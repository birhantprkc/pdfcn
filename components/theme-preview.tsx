"use client";

import { createElement, useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { replacePreviewImageSources } from "@/examples/preview-assets";
import { cn } from "@/lib/utils";
import { THEMES } from "@/registry/themes";
import type { RegistryThemeName } from "@/registry/themes";

const THEMES_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "executive", label: "Executive" },
  { value: "corporate", label: "Corporate" },
  { value: "elegant", label: "Elegant" },
  { value: "vivid", label: "Vivid" },
  { value: "forest", label: "Forest" },
  { value: "blueprint", label: "Blueprint" },
] as const;

interface ThemePreviewProps {
  name?: string;
  className?: string;
  height?: number;
}

export const ThemePreview = ({
  name = "invoice-classic",
  className,
  height = 640,
}: ThemePreviewProps) => {
  const [selectedTheme, setSelectedTheme] = useState<RegistryThemeName>("professional");
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
        const [
          { InvoiceClassicDocument },
          { renderSerializedDoc },
          { serialize },
        ] = await Promise.all([
          import("@/registry/bases/forme/blocks/invoice-classic/invoice-classic"),
          import("@formepdf/core/browser"),
          import("@formepdf/react"),
        ]);

        const theme = THEMES.find((t) => t.name === selectedTheme)?.theme;
        const document = replacePreviewImageSources(
          serialize(createElement(InvoiceClassicDocument, { theme }))
        );
        const buffer = await renderSerializedDoc(
          document as unknown as Record<string, unknown>
        );
        const pdfBytes = new Uint8Array(buffer);

        const source = new TextDecoder("latin1").decode(pdfBytes);
        const pageCounts = [...source.matchAll(/\/Count\s+(\d+)/g)].map((match) =>
          Number(match[1])
        );
        if (pageCounts.length > 0 && Math.max(...pageCounts) === 0) {
          throw new Error("PDF renderer returned a document with no pages");
        }

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
  }, [name, selectedTheme]);

  return (
    <div className={cn("not-prose", className)}>
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-muted/50 px-4 py-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-sm text-muted-foreground">document.pdf</span>
        <Select value={selectedTheme} onValueChange={(v) => setSelectedTheme(v as RegistryThemeName)}>
          <SelectTrigger className="h-8 w-[140px] bg-background text-sm font-medium">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {THEMES_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        ref={containerRef}
        className="overflow-hidden rounded-b-lg border bg-muted/30"
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
    </div>
  );
};
