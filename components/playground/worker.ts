import type * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import initPdf, { render } from "takumi-pdf";
import type { PageSize } from "takumi-pdf";

import { evaluateCodeExports, renderReact } from "./evaluate";
import { outputGeometry } from "./geometry";
import { inspectPdf } from "./inspect-pdf";
import { messageSchema } from "./schema";
import type { RenderMessageInput } from "./schema";

function postMessage(message: RenderMessageInput, transfer?: Transferable[]) {
  return self.postMessage(message, { transfer });
}

const TAKUMI_WASM_URL = new URL(
  "/takumi_pdf_wasm_bg.wasm",
  self.location.origin
);
const PREVIEW_LOGO_PATH = "/favicon.png";

let imagesReady:
  | Promise<{
      sources: { data: ArrayBuffer; src: string }[];
    }>
  | undefined;
let wasmReady: Promise<unknown> | undefined;

async function loadImages() {
  const response = await fetch(PREVIEW_LOGO_PATH);
  if (!response.ok) {
    throw new Error(`Unable to load preview logo (${response.status})`);
  }
  return {
    sources: [
      {
        data: await response.arrayBuffer(),
        src: PREVIEW_LOGO_PATH,
      },
    ],
  };
}

function getImages() {
  imagesReady ??= loadImages();
  return imagesReady;
}

async function initWasm() {
  wasmReady ??= initPdf({ module_or_path: TAKUMI_WASM_URL });
  await wasmReady;
}

async function renderRequest(id: number, code: string) {
  await initWasm();

  const { default: component, options } = evaluateCodeExports(
    code,
    renderReact
  );
  const element = renderReact.createElement(
    component as React.JSXElementConstructor<unknown>
  );
  const geometry = outputGeometry(options);

  postMessage({
    height: geometry.height,
    html: renderToStaticMarkup(element),
    id,
    padding: geometry.padding,
    type: "preview-result",
    width: geometry.width,
  });

  const start = performance.now();

  const pdfOptions = options.pdf ?? ({} as Record<string, unknown>);
  const pdfBytes = await render(element, {
    images: await getImages(),
    margin: pdfOptions.margin ?? { top: 48, right: 48, bottom: 48, left: 48 },
    size: (pdfOptions.size as PageSize | undefined) ?? "a4",
    ...pdfOptions,
  });

  const duration = performance.now() - start;

  postMessage(
    {
      result: {
        duration,
        id,
        inspection: inspectPdf(pdfBytes),
        label: geometry.label,
        outputBuffer: pdfBytes,
        outputFormat: "pdf",
        outputKind: "pdf",
        status: "success",
      },
      type: "render-result",
    },
    [pdfBytes.buffer]
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
          result: {
            id: payload.id,
            message: error instanceof Error ? error.message : "Unknown error",
            status: "error",
          },
          type: "render-result",
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
