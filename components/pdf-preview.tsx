"use client";

import { createElement, useEffect, useRef, useState } from "react";

import { replacePreviewImageSources } from "@/examples/preview-assets";
import { getTakumiPreviewOptions } from "@/examples/preview-config";
import { cn } from "@/lib/utils";
import type { BaseName } from "@/registry/bases";

const TAKUMI_WASM_PATH = "/takumi_pdf_wasm_bg.wasm";
const PREVIEW_LOGO_PATH = "/favicon.png";

let takumiWasmReady: Promise<unknown> | undefined;

interface PdfPreviewProps {
  base: BaseName;
  name: string;
  className?: string;
  height?: React.CSSProperties["height"];
}

const startTakumi = async (
  initialize: (input: { module_or_path: string }) => Promise<unknown>
) => {
  try {
    return await initialize({ module_or_path: TAKUMI_WASM_PATH });
  } catch (error) {
    takumiWasmReady = undefined;
    throw error;
  }
};

const initializeTakumi = (
  initialize: (input: { module_or_path: string }) => Promise<unknown>
) => {
  takumiWasmReady ??= startTakumi(initialize);
  return takumiWasmReady;
};

const loadPreviewLogo = async () => {
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

const assertPdfHasPages = (pdfBytes: Uint8Array) => {
  const source = new TextDecoder("latin1").decode(pdfBytes);
  const pageCounts = [...source.matchAll(/\/Count\s+(\d+)/g)].map((match) =>
    Number(match[1])
  );
  if (pageCounts.length > 0 && Math.max(...pageCounts) === 0) {
    throw new Error("PDF renderer returned a document with no pages");
  }
};

export const PdfPreview = ({
  base,
  name,
  className,
  height = 640,
}: PdfPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let nextPdfUrl: string | undefined;
    setPdfUrl(null);
    setError(null);

    (async () => {
      try {
        let pdfBytes: Uint8Array;

        if (base === "takumi") {
          const [
            { demos },
            { default: initialize, render },
            { fromJsx },
            images,
          ] = await Promise.all([
            import("@/examples/__takumi__"),
            import("takumi-pdf"),
            import("@takumi-rs/helpers/jsx"),
            loadPreviewLogo(),
          ]);
          const Demo = demos[name];
          if (!Demo) {
            throw new Error(`Unknown Takumi demo: ${name}`);
          }

          await initializeTakumi(initialize);
          const { node, stylesheets } = await fromJsx(createElement(Demo));
          const buffer = await render(node, {
            ...getTakumiPreviewOptions(name),
            images,
            stylesheets,
          });
          pdfBytes = new Uint8Array(buffer);
        } else {
          const [{ demos }, { renderSerializedDoc }, { serialize }] =
            await Promise.all([
              import("@/examples/__forme__"),
              import("@formepdf/core/browser"),
              import("@formepdf/react"),
            ]);
          const Demo = demos[name];
          if (!Demo) {
            throw new Error(`Unknown Forme demo: ${name}`);
          }

          // Serialize with the same @formepdf/react instance that created the
          // demo primitives. renderDocument() dynamically imports a second
          // serializer instance, whose strict Page identity check can drop all
          // pages when bundled by Next.js.
          const document = replacePreviewImageSources(
            serialize(createElement(Demo))
          );
          const buffer = await renderSerializedDoc(
            document as unknown as Record<string, unknown>
          );
          pdfBytes = new Uint8Array(buffer);
        }

        assertPdfHasPages(pdfBytes);
        nextPdfUrl = URL.createObjectURL(
          new Blob([pdfBytes as BlobPart], { type: "application/pdf" })
        );
        if (cancelled) {
          URL.revokeObjectURL(nextPdfUrl);
          return;
        }
        setPdfUrl(nextPdfUrl);
      } catch (renderError) {
        if (!cancelled) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Failed to render PDF"
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      if (nextPdfUrl) {
        URL.revokeObjectURL(nextPdfUrl);
      }
    };
  }, [base, name]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden rounded-lg border bg-muted/30", className)}
      style={{ minHeight: height }}
    >
      {error ? (
        <div
          className="flex items-center justify-center p-8 text-sm text-muted-foreground"
          style={{ minHeight: height }}
        >
          {error}
        </div>
      ) : null}
      {!error && !pdfUrl ? (
        <div
          className="flex items-center justify-center p-8 text-sm text-muted-foreground"
          style={{ minHeight: height }}
        >
          Rendering PDF…
        </div>
      ) : null}
      {pdfUrl ? (
        <iframe
          className="block w-full bg-background"
          src={`${pdfUrl}#toolbar=1&navpanes=0`}
          style={{ height }}
          title={`${name} PDF preview`}
        />
      ) : null}
    </div>
  );
};
