import type * as React from "react";
import initPdf, { render } from "takumi-pdf/no-init";
import type { PageSize } from "takumi-pdf/no-init";
import wasmUrl from "takumi-pdf/wasm-url";

import { evaluateCodeExports, renderReact } from "./evaluate";
import { inspectPdf } from "./inspect-pdf";
import { messageSchema } from "./schema";
import type { RenderMessageInput } from "./schema";

const postMessage = (message: RenderMessageInput, transfer?: Transferable[]) =>
  self.postMessage(message, { transfer });

const PREVIEW_LOGO_PATH = "/favicon.png";

const pageLabel = (size: PageSize | undefined, landscape: boolean): string => {
  const name =
    typeof size === "object"
      ? `${Math.round(size.width)} × ${Math.round(size.height)}`
      : (size ?? "a4").toUpperCase();

  return landscape ? `${name} landscape` : name;
};

let imagesReady:
  | Promise<{
      sources: { data: ArrayBuffer; src: string }[];
    }>
  | undefined;
let wasmReady: Promise<unknown> | undefined;

const loadImages = async () => {
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
};

const getImages = () => {
  imagesReady ??= loadImages();
  return imagesReady;
};

const initWasm = async () => {
  wasmReady ??= initPdf({ module_or_path: wasmUrl });
  await wasmReady;
};

const renderRequest = async (id: number, code: string) => {
  await initWasm();

  const { default: component, options } = evaluateCodeExports(
    code,
    renderReact
  );
  const element = renderReact.createElement(
    component as React.JSXElementConstructor<unknown>
  );
  const start = performance.now();

  const pdfOptions = options.pdf ?? ({} as Record<string, unknown>);
  const pdfBytes = await render(element, {
    images: await getImages(),
    ...pdfOptions,
  });

  const duration = performance.now() - start;

  postMessage(
    {
      result: {
        duration,
        id,
        inspection: inspectPdf(pdfBytes),
        label: pageLabel(
          pdfOptions.size as PageSize | undefined,
          pdfOptions.landscape === true
        ),
        outputBuffer: pdfBytes,
        outputFormat: "pdf",
        outputKind: "pdf",
        status: "success",
      },
      type: "render-result",
    },
    [pdfBytes.buffer]
  );
};

// eslint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener) -- Worker global onmessage
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
    case "render-result": {
      throw new Error("Respond message should not be sent from main window.");
    }
    default: {
      payload satisfies never;
    }
  }
};

postMessage({ type: "ready" });
