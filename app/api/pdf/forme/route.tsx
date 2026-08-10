import { renderPdf } from "@formepdf/core";
import { serialize } from "@formepdf/react";

import { demos } from "@/examples/__forme__";
import { replacePreviewImageSources } from "@/examples/preview-assets";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || !(name in demos)) {
    return new Response(`Unknown demo: ${name}`, { status: 404 });
  }

  try {
    const Demo = demos[name as keyof typeof demos];
    if (searchParams.get("format") === "document") {
      return Response.json({ document: serialize(<Demo />) });
    }

    // Keep serialization in this module so Forme sees the same primitive
    // identities used by the demo tree. renderDocument() dynamically imports
    // another serializer instance and can otherwise discard nested Pages.
    const document = replacePreviewImageSources(serialize(<Demo />));
    const pdfBytes = await renderPdf(JSON.stringify(document));

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Render failed";
    return new Response(message, { status: 500 });
  }
};
