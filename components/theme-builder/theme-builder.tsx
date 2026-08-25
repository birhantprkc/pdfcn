"use client";

import {
  Code2,
  Download,
  ExternalLink,
  Redo2,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { toast } from "sonner";

import { PdfPreview } from "@/components/pdf-preview-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { THEMES } from "@/registry/themes";

import { ThemeCodeDialog } from "./theme-code-dialog";
import { ThemeControls } from "./theme-controls";
import { writeThemeState } from "./theme-storage";
import { useThemeBuilder } from "./use-theme-builder";

const PERSIST_DELAY_MS = 300;

export const ThemeBuilder = () => {
  const { actions, basePreset, canRedo, canUndo, hydrated, theme } =
    useThemeBuilder();
  const previewTheme = useDeferredValue(theme);
  const [codeOpen, setCodeOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const activePreset = THEMES.find(({ name }) => name === basePreset);
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
      <div className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">Theme Builder</h1>
          </div>
          <Badge
            className="hidden gap-1.5 capitalize md:inline-flex"
            variant="secondary"
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: activePreset?.theme.colors.primary }}
            />
            {activePreset?.title}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              aria-label="Undo theme change"
              disabled={!canUndo}
              onClick={actions.undo}
              size="icon-sm"
              title="Undo (⌘Z)"
              variant="ghost"
            >
              <Undo2 />
            </Button>
            <Button
              aria-label="Redo theme change"
              disabled={!canRedo}
              onClick={actions.redo}
              size="icon-sm"
              title="Redo (⌘⇧Z)"
              variant="ghost"
            >
              <Redo2 />
            </Button>
          </div>

          <Separator
            className="mx-2 data-[orientation=vertical]:h-5"
            orientation="vertical"
          />

          <Button
            onClick={() => actions.loadPreset(basePreset)}
            size="sm"
            title={`Reset to ${activePreset?.title ?? basePreset}`}
            variant="outline"
          >
            <RotateCcw />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Separator
            className="mx-2 data-[orientation=vertical]:h-5"
            orientation="vertical"
          />

          {pdfUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={pdfUrl} rel="noopener noreferrer" target="_blank">
                Open in new
                <ExternalLink />
              </a>
            </Button>
          ) : (
            <Button disabled size="sm" variant="outline">
              Open in new
              <ExternalLink />
            </Button>
          )}

          <Button onClick={shareTheme} size="sm" variant="outline">
            <Share2 />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Separator
            className="mx-2 data-[orientation=vertical]:h-5"
            orientation="vertical"
          />

          {pdfUrl ? (
            <Button asChild size="sm" variant="outline">
              <a download={`${safeThemeName}-preview.pdf`} href={pdfUrl}>
                <Download />
                <span className="hidden md:inline">Download</span>
              </a>
            </Button>
          ) : (
            <Button disabled size="sm" variant="outline">
              <Download />
              <span className="hidden md:inline">Download</span>
            </Button>
          )}

          <Button onClick={() => setCodeOpen(true)} size="sm">
            <Code2 />
            <span className="hidden sm:inline">Get code</span>
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section
          className="relative min-h-0 overflow-hidden bg-muted/35 p-2 sm:p-4"
          aria-label="Live PDF preview"
        >
          <div className="mx-auto h-full max-w-5xl overflow-hidden rounded-xl border bg-background shadow-sm">
            <PdfPreview
              base="forme"
              className="h-full rounded-none border-0"
              height="100%"
              name="invoice-classic"
              onUrlChange={handlePdfUrlChange}
              theme={previewTheme}
            />
          </div>

          <Button
            className="absolute right-5 bottom-5 shadow-lg lg:hidden"
            onClick={() => setCustomizerOpen(true)}
          >
            <SlidersHorizontal />
            Customize
          </Button>
        </section>

        <aside
          className="hidden min-h-0 flex-col border-l bg-background lg:flex"
          aria-label="Theme controls"
        >
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Customize</h2>
            <p className="text-xs text-muted-foreground">
              Changes render in the preview automatically.
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <ThemeControls
              actions={actions}
              basePreset={basePreset}
              idPrefix="desktop"
              theme={theme}
            />
          </div>
        </aside>
      </div>

      <Sheet onOpenChange={setCustomizerOpen} open={customizerOpen}>
        <SheetContent
          className="w-full gap-0 p-0 sm:max-w-md lg:hidden"
          side="right"
        >
          <SheetHeader className="border-b pr-12">
            <SheetTitle>Customize theme</SheetTitle>
            <SheetDescription>
              Changes render in the preview automatically.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <ThemeControls
              actions={actions}
              basePreset={basePreset}
              idPrefix="mobile"
              theme={theme}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ThemeCodeDialog
        onOpenChange={setCodeOpen}
        open={codeOpen}
        theme={theme}
      />
    </div>
  );
};
