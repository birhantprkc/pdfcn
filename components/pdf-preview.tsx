"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    setPage(1);

    (async () => {
      try {
        if (base === "takumi") {
          const res = await fetch(
            `/api/pdf/takumi?name=${encodeURIComponent(name)}`
          );
          if (!res.ok) {
            throw new Error(await res.text());
          }
          const buf = new Uint8Array(await res.arrayBuffer());
          if (!cancelled) {
            setData(buf);
          }
          return;
        }

        const res = await fetch(
          `/api/pdf/forme?name=${encodeURIComponent(name)}`
        );
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const buf = new Uint8Array(await res.arrayBuffer());
        if (!cancelled) {
          setData(buf);
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
      {data && (
        <div className="flex flex-col items-center gap-3 p-4">
          <Document
            file={{ data }}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={null}
          >
            <Page pageNumber={page} width={560} />
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
