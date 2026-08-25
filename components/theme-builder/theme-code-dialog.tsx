"use client";

import { Check, Copy, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PdfcnTheme } from "@/registry/themes";

interface ThemeCodeDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  theme: PdfcnTheme;
}

export const ThemeCodeDialog = ({
  onOpenChange,
  open,
  theme,
}: ThemeCodeDialogProps) => {
  const [copied, setCopied] = useState(false);
  const code = useMemo(
    () =>
      `import type { PdfcnTheme } from "@/registry/themes";\n\nexport const customTheme: PdfcnTheme = ${JSON.stringify(theme, null, 2)};\n`,
    [theme]
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCopied(false);
    }
    onOpenChange(nextOpen);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Theme code copied");
    } catch {
      toast.error("Could not copy theme code");
    }
  };

  const downloadCode = () => {
    const objectUrl = URL.createObjectURL(
      new Blob([code], { type: "text/typescript;charset=utf-8" })
    );
    const link = document.createElement("a");
    const safeName =
      theme.name
        .trim()
        .toLowerCase()
        .replaceAll(/[^a-z0-9-]+/g, "-") || "custom-theme";
    link.download = `${safeName}.ts`;
    link.href = objectUrl;
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b p-5 pr-12">
          <DialogTitle>Theme code</DialogTitle>
          <DialogDescription>
            Copy this object into your project and pass it to any themed pdfcn
            document.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {theme.name || "custom-theme"}.ts
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={downloadCode} size="sm" variant="ghost">
              <Download />
              Download
            </Button>
            <Button onClick={copyCode} size="sm" variant="outline">
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
        <pre className="max-h-[65svh] overflow-auto bg-zinc-950 p-5 font-mono text-xs leading-relaxed text-zinc-100">
          <code>{code}</code>
        </pre>
      </DialogContent>
    </Dialog>
  );
};
