"use client";

import type { ReactNode } from "react";
import type { PdfInspection } from "./inspect-pdf";
import type { RenderError, RenderSuccess } from "./use-render-worker";
import { cn } from "@/lib/utils";

function PdfPreview({ url, dimmed }: { url: string | undefined; dimmed: boolean }) {
  if (!url) return null;
  return (
    <object
      data={url}
      type="application/pdf"
      aria-label="Rendered PDF"
      className={cn("size-full", dimmed && "opacity-40")}
    >
      <div className="flex h-full items-center justify-center p-6 text-center font-mono text-xs text-muted-foreground">
        <a href={url} target="_blank" rel="noreferrer" className="underline">
          Open PDF in new tab
        </a>
      </div>
    </object>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 border-b py-1.5 last:border-b-0">
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function DocumentPanel({ inspection }: { inspection: PdfInspection }) {
  return (
    <div className="h-full overflow-auto bg-muted/20 px-4 py-3 font-mono text-xs">
      <Field label="Standards">
        {inspection.standards.length > 0 ? (
          <span className="text-primary">{inspection.standards.join(" · ")}</span>
        ) : (
          <span className="text-muted-foreground">plain PDF</span>
        )}
      </Field>
      <Field label="Tagged">{inspection.tagged ? "yes" : "no"}</Field>
      <Field label="Pages">{inspection.pages}</Field>
      {inspection.title && <Field label="Title">{inspection.title}</Field>}
      {inspection.authors && <Field label="Authors">{inspection.authors.join(", ")}</Field>}
      {inspection.created && <Field label="Created">{inspection.created}</Field>}
      <Field label="Bookmarks">
        {inspection.bookmarks.length === 0 ? (
          <span className="text-muted-foreground">none</span>
        ) : (
          inspection.bookmarks.map((bookmark, index) => (
            <div
              key={`${bookmark.title}-${index}`}
              style={{ paddingLeft: bookmark.depth * 12 }}
              className="truncate"
            >
              {bookmark.title}
            </div>
          ))
        )}
      </Field>
      <Field label="Attachments">
        {inspection.attachments.length === 0 ? (
          <span className="text-muted-foreground">none</span>
        ) : (
          inspection.attachments.map((attachment) => (
            <div key={attachment.name} className="truncate">
              {attachment.name}
              {attachment.description && (
                <span className="text-muted-foreground"> — {attachment.description}</span>
              )}
            </div>
          ))
        )}
      </Field>
    </div>
  );
}

export type PdfView = "preview" | "document";

export function OutputPanel({
  lastSuccess,
  error,
  isReady,
  pdfView,
}: {
  lastSuccess: RenderSuccess | undefined;
  error: RenderError | undefined;
  isReady: boolean;
  pdfView: PdfView;
}) {
  if (!lastSuccess && !error) {
    return (
      <div className="flex h-full items-center justify-center gap-2 bg-muted/20 font-mono text-xs text-muted-foreground">
        <div className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        {isReady ? "rendering…" : "loading wasm…"}
      </div>
    );
  }

  if (lastSuccess?.outputKind === "pdf" && pdfView === "document" && lastSuccess.inspection) {
    return <DocumentPanel inspection={lastSuccess.inspection} />;
  }

  const output =
    lastSuccess &&
    (lastSuccess.outputKind === "pdf" ? (
      <PdfPreview url={lastSuccess.outputUrl} dimmed={Boolean(error)} />
    ) : (
      <img
        src={lastSuccess.outputUrl}
        alt="Rendered output"
        className={cn("border max-h-full max-w-full object-contain", error && "opacity-40")}
      />
    ));

  return (
    <div className="relative h-full min-w-0 overflow-hidden bg-muted/20">
      {lastSuccess?.outputKind === "pdf" ? (
        <div className="absolute inset-0">{output}</div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">{output}</div>
      )}
      {error && (
        <div className="absolute inset-x-0 bottom-0 border-t bg-background/95 px-3 py-2 font-mono text-xs">
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-muted-foreground">
            {error.message}
          </pre>
        </div>
      )}
    </div>
  );
}
