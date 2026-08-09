import initPdf, { render, type PageSize } from "takumi-pdf";
import { googleFonts } from "@takumi-rs/helpers";
import type * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { evaluateCodeExports, renderReact } from "./evaluate";
import { outputGeometry } from "./geometry";
import { inspectPdf } from "./inspect-pdf";
import { messageSchema, type RenderMessageInput } from "./schema";

function postMessage(message: RenderMessageInput, transfer?: Transferable[]) {
  return self.postMessage(message, { transfer });
}

const GOOGLE_FONT_NAMES = ["Inter", "Times New Roman"];

let fontsReady: ReturnType<typeof googleFonts> | undefined;
let wasmReady: Promise<unknown> | undefined;

function getFonts() {
  fontsReady ??= googleFonts(GOOGLE_FONT_NAMES);
  return fontsReady;
}

async function initWasm() {
  wasmReady ??= initPdf();
  await wasmReady;
}

async function renderRequest(id: number, code: string) {
  await initWasm();

  const { default: component, options } = evaluateCodeExports(code, renderReact);
  const element = renderReact.createElement(component as React.JSXElementConstructor<unknown>);
  const geometry = outputGeometry(options);

  postMessage({
    type: "preview-result",
    id,
    html: renderToStaticMarkup(element),
    width: geometry.width,
    height: geometry.height,
    padding: geometry.padding,
  });

  const fonts = await getFonts();
  const start = performance.now();

  const pdfOptions = options.pdf ?? {} as Record<string, unknown>;
  const pdfBytes = await render(element, {
    fonts,
    size: (pdfOptions.size as PageSize | undefined) ?? "a4",
    margin: pdfOptions.margin ?? { top: 48, right: 48, bottom: 48, left: 48 },
    ...pdfOptions,
  });

  const duration = performance.now() - start;

  postMessage(
    {
      type: "render-result",
      result: {
        status: "success",
        id,
        outputBuffer: pdfBytes,
        duration,
        outputKind: "pdf",
        outputFormat: "pdf",
        label: geometry.label,
        inspection: inspectPdf(pdfBytes),
      },
    },
    [pdfBytes.buffer],
  );
}

self.onmessage = async (event: MessageEvent) => {
  const payload = messageSchema.parse(event.data);

  switch (payload.type) {
    case "render-request": {
      try {
        await renderRequest(payload.id, payload.code);
      } catch (error) {
        postMessage({
          type: "render-result",
          result: {
            status: "error",
            id: payload.id,
            message: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
      break;
    }
    case "ready":
    case "render-result":
    case "preview-result": {
      throw new Error("Respond message should not be sent from main window.");
    }
    default: {
      payload satisfies never;
    }
  }
};

postMessage({ type: "ready" });
