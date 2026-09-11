"use client";

import { useState } from "react";

import { PdfPreview } from "@/components/pdf-preview-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BaseName } from "@/registry/bases";
import { THEMES } from "@/registry/themes";
import type { RegistryThemeName } from "@/registry/themes";

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

  const theme = THEMES.find((t) => t.name === selectedTheme)?.theme;

  return (
    <div className={cn("not-prose mt-4", className)}>
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
          <SelectTrigger className="w-35 bg-background">
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
      <PdfPreview
        base={base}
        name={name}
        theme={theme}
        height={height}
        className="rounded-none rounded-b-lg border"
      />
    </div>
  );
};
