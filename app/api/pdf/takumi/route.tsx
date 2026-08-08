import { googleFonts } from "@takumi-rs/helpers";
import { render } from "takumi-pdf";

import { demos } from "@/examples/__index__";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || !(name in demos.takumi)) {
    return new Response(`Unknown demo: ${name}`, { status: 404 });
  }

  try {
    const Demo = demos.takumi[name as keyof typeof demos.takumi];
    const pdf = await render(<Demo />, {
      fonts: await googleFonts(["Inter", "Times New Roman"]),
      margin: { bottom: 48, left: 48, right: 48, top: 48 },
      size: "a4",
    });

    return new Response(Buffer.from(pdf), {
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
