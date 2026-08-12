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
import { getTakumiPreviewOptions } from "@/examples/preview-config";
import { cn } from "@/lib/utils";
import type { BaseName } from "@/registry/bases";
import { THEMES } from "@/registry/themes";
import type { RegistryThemeName } from "@/registry/themes";

const TAKUMI_WASM_PATH = "/takumi_pdf_wasm_bg.wasm";
const PREVIEW_LOGO_PATH = "/favicon.png";

let takumiWasmReady: Promise<unknown> | undefined;

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

const THEMES_OPTIONS = [
  { label: "Professional", value: "professional" },
  { label: "Modern", value: "modern" },
  { label: "Minimal", value: "minimal" },
  { label: "Executive", value: "executive" },
  { label: "Corporate", value: "corporate" },
  { label: "Elegant", value: "elegant" },
  { label: "Vivid", value: "vivid" },
  { label: "Forest", value: "forest" },
  { label: "Blueprint", value: "blueprint" },
] as const;

interface ThemePreviewProps {
  base?: BaseName;
  name?: string;
  className?: string;
  height?: number;
}

export const ThemePreview = ({
  base = "forme",
  name = "invoice-classic",
  className,
  height = 640,
}: ThemePreviewProps) => {
  const [selectedTheme, setSelectedTheme] =
    useState<RegistryThemeName>("professional");
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
        const theme = THEMES.find((t) => t.name === selectedTheme)?.theme;

        if (base === "takumi") {
          const [
            { InvoiceClassicDocument },
            { default: initialize, render },
            { fromJsx },
            images,
          ] = await Promise.all([
            import("@/registry/bases/takumi/blocks/invoice-classic/invoice-classic"),
            import("takumi-pdf"),
            import("@takumi-rs/helpers/jsx"),
            loadPreviewLogo(),
          ]);

          await initializeTakumi(initialize);
          const { node, stylesheets } = await fromJsx(
            createElement(InvoiceClassicDocument, { theme })
          );
          const buffer = await render(node, {
            ...getTakumiPreviewOptions(name),
            images,
            stylesheets,
          });
          const pdfBytes = new Uint8Array(buffer);

          const source = new TextDecoder("latin1").decode(pdfBytes);
          const pageCounts = [...source.matchAll(/\/Count\s+(\d+)/g)].map(
            (match) => Number(match[1])
          );
          if (pageCounts.length > 0 && Math.max(...pageCounts) === 0) {
            throw new Error("PDF renderer returned a document with no pages");
          }

          nextPdfUrl = URL.createObjectURL(
            new Blob([pdfBytes as BlobPart], { type: "application/pdf" })
          );
        } else {
          const [
            { InvoiceClassicDocument },
            { renderSerializedDoc },
            { serialize },
          ] = await Promise.all([
            import("@/registry/bases/forme/blocks/invoice-classic/invoice-classic"),
            import("@formepdf/core/browser"),
            import("@formepdf/react"),
          ]);

          const document = replacePreviewImageSources(
            serialize(createElement(InvoiceClassicDocument, { theme }))
          );
          const buffer = await renderSerializedDoc(
            document as unknown as Record<string, unknown>
          );
          const pdfBytes = new Uint8Array(buffer);

          const source = new TextDecoder("latin1").decode(pdfBytes);
          const pageCounts = [...source.matchAll(/\/Count\s+(\d+)/g)].map(
            (match) => Number(match[1])
          );
          if (pageCounts.length > 0 && Math.max(...pageCounts) === 0) {
            throw new Error("PDF renderer returned a document with no pages");
          }

          nextPdfUrl = URL.createObjectURL(
            new Blob([pdfBytes as BlobPart], { type: "application/pdf" })
          );
        }

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
  }, [base, name, selectedTheme]);

  return (
    <div className={cn("not-prose", className)}>
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-muted/50 px-4 py-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-sm text-muted-foreground">document.pdf</span>
        <Select
          value={selectedTheme}
          onValueChange={(v) => setSelectedTheme(v as RegistryThemeName)}
        >
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
