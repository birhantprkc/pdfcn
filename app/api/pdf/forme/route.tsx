import { renderDocument } from "@formepdf/core";

import { demos } from "@/examples/__index__";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || !(name in demos.forme)) {
    return new Response(`Unknown demo: ${name}`, { status: 404 });
  }

  try {
    const Demo = demos.forme[name as keyof typeof demos.forme];
    const pdfBytes = await renderDocument(<Demo />);

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
}
