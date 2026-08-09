"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRenderWorker } from "./use-render-worker";
import { OutputPanel, type PdfView } from "./output-panel";

interface TakumiPreviewProps {
  code: string;
  className?: string;
  height?: number;
}

export function TakumiPreview({ code, className, height = 640 }: TakumiPreviewProps) {
  const [pdfView, setPdfView] = useState<PdfView>("preview");
  const { isReady, lastSuccess, renderError } = useRenderWorker(code);

  return (
    <div
      className={cn("overflow-hidden rounded-lg border bg-muted/30", className)}
      style={{ minHeight: height }}
    >
      <div className="flex h-6 shrink-0 items-center gap-1.5 border-b px-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        <span>PDF Preview</span>
        {lastSuccess?.outputKind === "pdf" && (
          <div className="ml-auto flex items-center gap-1">
            {(["preview", "document"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setPdfView(id)}
                className={cn(
                  "rounded-sm px-1.5 py-0.5 uppercase transition-colors hover:text-foreground",
                  pdfView === id && "bg-muted text-foreground"
                )}
              >
                {id}
              </button>
            ))}
            {lastSuccess?.outputUrl && (
              <a
                href={lastSuccess.outputUrl}
                target="_blank"
                rel="noreferrer"
                title="Open PDF in new tab"
                className="rounded-sm px-1 py-0.5 transition-colors hover:text-foreground"
              >
                ↗
              </a>
            )}
          </div>
        )}
      </div>
      <div style={{ height: height - 24 }}>
        <OutputPanel
          lastSuccess={lastSuccess}
          error={renderError}
          isReady={isReady}
          pdfView={pdfView}
        />
      </div>
    </div>
  );
}
