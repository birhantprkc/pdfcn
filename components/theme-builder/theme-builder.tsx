"use client";

import {
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  Redo2,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { toast } from "sonner";

import { FormeIcon, TakumiIcon } from "@/components/icons";
import { PdfPreview } from "@/components/pdf-preview-wrapper";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { BaseName } from "@/registry/bases";

import { ThemeCodeDialog } from "./theme-code-dialog";
import { ThemeControls } from "./theme-controls";
import { writeThemeState } from "./theme-storage";
import { useThemeBuilder } from "./use-theme-builder";

const PERSIST_DELAY_MS = 300;

const BASE_SWITCHER = [
  { icon: TakumiIcon, name: "takumi" as const },
  { icon: FormeIcon, name: "forme" as const },
];

export const ThemeBuilder = ({ base }: { base: BaseName }) => {
  const { actions, basePreset, canRedo, canUndo, hydrated, theme } =
    useThemeBuilder();
  const previewTheme = useDeferredValue(theme);
  const [codeOpen, setCodeOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const safeThemeName =
    theme.name
      .trim()
      .toLowerCase()
      .replaceAll(/[^a-z0-9-]+/g, "-") || "theme";

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timeout = window.setTimeout(() => {
      writeThemeState({ basePreset, theme });
    }, PERSIST_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [basePreset, hydrated, theme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { target } = event;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      if (!(event.metaKey || event.ctrlKey)) {
        return;
      }

      if (event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        actions.undo();
      } else if (
        event.key.toLowerCase() === "y" ||
        (event.key.toLowerCase() === "z" && event.shiftKey)
      ) {
        event.preventDefault();
        actions.redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [actions]);

  const handlePdfUrlChange = useCallback((url: string | null) => {
    setPdfUrl(url);
  }, []);

  const shareTheme = async () => {
    writeThemeState({ basePreset, theme });
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Share link copied");
    } catch {
      toast.error("Could not copy the share link");
    }
  };

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-[680px] flex-col overflow-hidden border-t bg-background">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-6 py-2 max-lg:flex-nowrap max-lg:overflow-x-auto **:data-[slot=separator]:h-5!">
        <div
          className="flex shrink-0 items-center gap-0.5 rounded-lg bg-muted p-0.5"
          role="radiogroup"
          aria-label="PDF renderer base"
        >
          {BASE_SWITCHER.map(({ icon: Icon, name }) => (
            <Button
              key={name}
              asChild
              className={cn(
                "h-7 gap-1.5 border border-transparent px-2 text-sm capitalize",
                base === name
                  ? "bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground"
                  : "text-muted-foreground"
              )}
              size="sm"
              variant="ghost"
            >
              <Link
                aria-current={base === name}
                href={`/theme-builder/${name}`}
              >
                <Icon aria-hidden="true" />
                {name}
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="md:hidden" orientation="vertical" />

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Undo theme change"
                disabled={!canUndo}
                onClick={actions.undo}
                size="icon-sm"
                variant="ghost"
              >
                <Undo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Redo theme change"
                disabled={!canRedo}
                onClick={actions.redo}
                size="icon-sm"
                variant="ghost"
              >
                <Redo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Reset to preset defaults"
                onClick={() => actions.loadPreset(basePreset)}
                size="sm"
                variant="outline"
              >
                <RotateCcw />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset to preset defaults</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" />

          <Tooltip>
            <TooltipTrigger asChild>
              {pdfUrl ? (
                <Button asChild size="sm" variant="outline">
                  <a
                    aria-label="Open PDF in new tab"
                    href={pdfUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="hidden sm:inline">Open</span>
                    <ExternalLink />
                  </a>
                </Button>
              ) : (
                <Button
                  aria-label="Open PDF in new tab"
                  disabled
                  size="sm"
                  variant="outline"
                >
                  <span className="hidden sm:inline">Open</span>
                  <ExternalLink />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>Open PDF in new tab</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Copy share link"
                onClick={shareTheme}
                size="sm"
                variant="outline"
              >
                <Share2 />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share theme</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" />

          <Tooltip>
            <TooltipTrigger asChild>
              {pdfUrl ? (
                <Button asChild size="sm" variant="outline">
                  <a
                    aria-label="Download preview PDF"
                    download={`${safeThemeName}-preview.pdf`}
                    href={pdfUrl}
                  >
                    <Download />
                    <span className="hidden md:inline">Download</span>
                  </a>
                </Button>
              ) : (
                <Button
                  aria-label="Download preview PDF"
                  disabled
                  size="sm"
                  variant="outline"
                >
                  <Download />
                  <span className="hidden md:inline">Download</span>
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>Download PDF</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Get theme code"
                className="gap-1.5"
                onClick={() => setCodeOpen(true)}
                size="sm"
              >
                <Code2 />
                Code
              </Button>
            </TooltipTrigger>
            <TooltipContent>Get theme code</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1 transition-[grid-template-columns] duration-300 ease-in-out",
          sidebarOpen
            ? "lg:grid-cols-[minmax(0,1fr)_390px]"
            : "lg:grid-cols-[minmax(0,1fr)_0px]"
        )}
      >
        <section
          className="relative min-h-0 overflow-hidden bg-muted/35 p-6"
          aria-label="Live PDF preview"
        >
          <div className="mx-auto h-full max-w-5xl overflow-hidden rounded-xl border bg-background shadow-sm">
            <PdfPreview
              base={base}
              className="h-full rounded-none border-0"
              height="100%"
              name="invoice-classic"
              onUrlChange={handlePdfUrlChange}
              theme={previewTheme}
            />
          </div>

          <Button
            className="absolute right-6 bottom-6 shadow-lg lg:hidden"
            onClick={() => setCustomizerOpen(true)}
          >
            <SlidersHorizontal />
            Customize
          </Button>

          {sidebarOpen ? null : (
            <Button
              className="absolute right-6 bottom-6 shadow-lg max-lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal />
              Customize
            </Button>
          )}

          <div
            className={cn(
              "absolute inset-y-0 right-0 z-20 flex w-full flex-col border-l bg-background shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
              customizerOpen
                ? "translate-x-0"
                : "pointer-events-none translate-x-full"
            )}
            aria-hidden={!customizerOpen}
          >
            <div className="flex items-start justify-between border-b px-6 py-3">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">Customize theme</h2>
                <p className="text-xs text-muted-foreground">
                  Changes render in the preview automatically.
                </p>
              </div>
              <Button
                aria-label="Close customize panel"
                onClick={() => setCustomizerOpen(false)}
                size="icon-sm"
                title="Hide panel"
                variant="ghost"
              >
                <ChevronRight />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <ThemeControls
                actions={actions}
                basePreset={basePreset}
                idPrefix="mobile"
                theme={theme}
              />
            </div>
          </div>
        </section>

        <aside
          className={cn(
            "hidden min-h-0 flex-col overflow-hidden bg-background lg:flex",
            sidebarOpen && "border-l"
          )}
          aria-hidden={!sidebarOpen}
          aria-label="Theme controls"
        >
          <div className="flex h-full w-[390px] min-h-0 flex-col">
            <div className="flex items-start justify-between border-b px-6 py-3">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">Customize</h2>
                <p className="text-xs text-muted-foreground">
                  Changes render in the preview automatically.
                </p>
              </div>
              <Button
                aria-label="Close customize panel"
                onClick={() => setSidebarOpen(false)}
                size="icon-sm"
                title="Hide panel"
                variant="ghost"
              >
                <ChevronRight />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <ThemeControls
                actions={actions}
                basePreset={basePreset}
                idPrefix="desktop"
                theme={theme}
              />
            </div>
          </div>
        </aside>
      </div>

      <ThemeCodeDialog
        basePreset={basePreset}
        onOpenChange={setCodeOpen}
        open={codeOpen}
        theme={theme}
      />
    </div>
  );
};
