import { readFile } from "node:fs/promises";
import path from "node:path";

import { fromJsx } from "@takumi-rs/helpers/jsx";
import { render } from "takumi-pdf/next";

import { demos } from "@/examples/__index__";
import { getTakumiPreviewOptions } from "@/examples/preview-config";

const takumiDemos = demos.takumi;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || !(name in takumiDemos)) {
    return new Response(`Unknown demo: ${name}`, { status: 404 });
  }

  try {
    const Demo = takumiDemos[name];
    if (searchParams.get("format") === "document") {
      return Response.json(await fromJsx(<Demo />));
    }

    const logo = await readFile(path.join(process.cwd(), "public/favicon.png"));
    const pdf = await render(<Demo />, {
      ...getTakumiPreviewOptions(name),
      images: {
        sources: [{ data: logo, src: "/favicon.png" }],
      },
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
