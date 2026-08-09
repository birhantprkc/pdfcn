"use client";

import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { cn } from "@/lib/utils";
import type { BaseName } from "@/registry/bases";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfPreviewProps {
  base: BaseName;
  name: string;
  className?: string;
  height?: number;
}

export const PdfPreview = ({
  base,
  name,
  className,
  height = 640,
}: PdfPreviewProps) => {
  const [data, setData] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(560);
  const containerRef = useRef<HTMLDivElement>(null);
  const file = useMemo(() => (data ? { data } : null), [data]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateWidth = () => {
      setPageWidth(Math.min(560, Math.max(240, container.clientWidth - 32)));
    };
    const observer = new ResizeObserver(updateWidth);
    updateWidth();
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    setPage(1);

    (async () => {
      try {
        if (base === "takumi") {
          const [
            { demos },
            { default: initialize, render },
            pdfWasmModule,
            { googleFonts },
            { fromJsx },
          ] = await Promise.all([
            import("@/examples/__takumi__"),
            import("takumi-pdf"),
            import("takumi-pdf/takumi_pdf_wasm_bg.wasm"),
            import("@takumi-rs/helpers"),
            import("@takumi-rs/helpers/jsx"),
          ]);
          const Demo = demos[name];
          if (!Demo) {
            throw new Error(`Unknown Takumi demo: ${name}`);
          }
          const { node, stylesheets } = await fromJsx(createElement(Demo));
          const pdfWasm = (
            pdfWasmModule as unknown as { default: string }
          ).default;
          await initialize({ module_or_path: pdfWasm });
          const buf = await render(node, {
            fonts: await googleFonts(["Inter", "Times New Roman"]),
            margin: { bottom: 48, left: 48, right: 48, top: 48 },
            size: "a4",
            stylesheets,
          });
          if (!cancelled) {
            setData(new Uint8Array(buf));
          }
          return;
        }

        const [{ demos }, { renderDocument }] = await Promise.all([
          import("@/examples/__forme__"),
          import("@formepdf/core/browser"),
        ]);
        const Demo = demos[name];
        if (!Demo) {
          throw new Error(`Unknown Forme demo: ${name}`);
        }
        const buf = await renderDocument(createElement(Demo));
        if (!cancelled) {
          setData(new Uint8Array(buf));
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to render PDF"
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [base, name]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden rounded-lg border bg-muted/30", className)}
      style={{ minHeight: height }}
    >
      {error && (
        <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
          {error}
        </div>
      )}
      {!error && !data && (
        <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
          Rendering PDF…
        </div>
      )}
      {file && (
        <div className="flex flex-col items-center gap-3 p-4">
          <Document
            file={file}
            onLoadError={(loadError) => setError(loadError.message)}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={null}
          >
            <Page pageNumber={page} width={pageWidth} />
          </Document>
          {numPages > 1 && (
            <div className="flex items-center gap-3 text-sm">
              <button
                type="button"
                className="rounded border px-2 py-1 disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span>
                {page} / {numPages}
              </span>
              <button
                type="button"
                className="rounded border px-2 py-1 disabled:opacity-40"
                disabled={page >= numPages}
                onClick={() => setPage((p) => Math.min(numPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
