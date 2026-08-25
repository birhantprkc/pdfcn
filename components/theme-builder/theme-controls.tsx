"use client";

import { Check, LayoutTemplate, Palette, Type } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PdfcnTheme, ThemePresetName } from "@/registry/themes";
import { THEMES } from "@/registry/themes";

import type {
  ColorTokenName,
  HeadingLevel,
  PageMargin,
  SpacingTokenName,
  ThemeBuilderActions,
} from "./use-theme-builder";

const COLOR_FIELDS = [
  { key: "background", label: "Background" },
  { key: "foreground", label: "Foreground" },
  { key: "primary", label: "Primary" },
  { key: "primaryForeground", label: "Primary foreground" },
  { key: "muted", label: "Muted" },
  { key: "mutedForeground", label: "Muted foreground" },
  { key: "accent", label: "Accent" },
  { key: "border", label: "Border" },
  { key: "destructive", label: "Destructive" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
] as const satisfies readonly {
  key: ColorTokenName;
  label: string;
}[];

const FONT_OPTIONS = [
  "Helvetica",
  "Times-Roman",
  "Courier",
  "Inter",
  "Lato",
  "Lora",
  "Merriweather",
  "Nunito",
  "Open Sans",
  "Playfair Display",
  "Source Code Pro",
  "JetBrains Mono",
] as const;

const HEADING_LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

interface NumberFieldProps {
  label: string;
  max: number;
  min: number;
  onCommit: (value: number) => void;
  step?: number;
  suffix?: string;
  value: number;
}

const NumberField = ({
  label,
  max,
  min,
  onCommit,
  step = 1,
  suffix,
  value,
}: NumberFieldProps) => (
  <label className="grid gap-1.5 text-xs font-medium text-foreground">
    <span className="flex items-center justify-between gap-2">
      {label}
      {suffix ? (
        <span className="font-normal text-muted-foreground">{suffix}</span>
      ) : null}
    </span>
    <Input
      key={`${label}-${value}`}
      className="h-8 tabular-nums"
      defaultValue={value}
      max={max}
      min={min}
      onBlur={(event) => {
        const parsed = Number(event.currentTarget.value);
        if (!Number.isFinite(parsed)) {
          event.currentTarget.value = String(value);
          return;
        }

        const nextValue = Math.min(max, Math.max(min, parsed));
        event.currentTarget.value = String(nextValue);
        onCommit(nextValue);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }
      }}
      step={step}
      type="number"
    />
  </label>
);

interface ColorFieldProps {
  label: string;
  onCommit: (value: string) => void;
  value: string;
}

const ColorField = ({ label, onCommit, value }: ColorFieldProps) => (
  <div className="flex items-center gap-3 rounded-lg border bg-card p-2.5">
    <Input
      aria-label={`Choose ${label.toLowerCase()} color`}
      className="size-9 cursor-pointer rounded-md border-0 p-0.5 shadow-none"
      onChange={(event) => onCommit(event.currentTarget.value)}
      type="color"
      value={value}
    />
    <label className="min-w-0 flex-1">
      <span className="block truncate text-xs font-medium">{label}</span>
      <Input
        key={`${label}-${value}`}
        aria-label={`${label} hex value`}
        className="mt-1 h-7 px-2 font-mono text-[11px] uppercase"
        defaultValue={value}
        maxLength={7}
        onBlur={(event) => {
          const nextValue = event.currentTarget.value.trim();
          if (/^#[0-9a-f]{6}$/i.test(nextValue)) {
            onCommit(nextValue.toLowerCase());
          } else {
            event.currentTarget.value = value;
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        spellCheck={false}
      />
    </label>
  </div>
);

interface ThemeControlsProps {
  actions: ThemeBuilderActions;
  basePreset: ThemePresetName;
  className?: string;
  idPrefix: string;
  theme: PdfcnTheme;
}

export const ThemeControls = ({
  actions,
  basePreset,
  className,
  idPrefix,
  theme,
}: ThemeControlsProps) => (
  <div className={cn("space-y-5 p-4", className)}>
    <Card className="gap-4 py-4 shadow-none">
      <CardHeader className="gap-1 px-4">
        <CardTitle className="text-sm">Theme</CardTitle>
        <CardDescription className="text-xs">
          Start from a built-in pdfcn preset.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        <label
          className="grid gap-1.5 text-xs font-medium"
          htmlFor={`${idPrefix}-theme-name`}
        >
          Export name
          <Input
            key={theme.name}
            id={`${idPrefix}-theme-name`}
            className="h-8"
            defaultValue={theme.name}
            maxLength={48}
            onBlur={(event) => {
              const nextName = event.currentTarget.value.trim();
              if (nextName) {
                actions.setName(nextName);
              } else {
                event.currentTarget.value = theme.name;
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
        </label>

        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(({ name, theme: presetTheme, title }) => {
            const selected = name === basePreset;
            return (
              <Button
                key={name}
                aria-pressed={selected}
                className={cn(
                  "relative h-auto min-w-0 flex-col items-stretch gap-2 px-2.5 py-2.5 text-left",
                  selected && "border-primary bg-primary/5"
                )}
                onClick={() => actions.loadPreset(name)}
                size="sm"
                variant="outline"
              >
                <span className="flex w-full items-center gap-1">
                  <span
                    className="size-3.5 shrink-0 rounded-full border"
                    style={{ backgroundColor: presetTheme.colors.primary }}
                  />
                  <span className="truncate text-[11px]">{title}</span>
                  {selected ? <Check className="ml-auto size-3" /> : null}
                </span>
                <span className="flex gap-0.5" aria-hidden="true">
                  {[
                    presetTheme.colors.background,
                    presetTheme.colors.foreground,
                    presetTheme.colors.muted,
                    presetTheme.colors.accent,
                  ].map((color) => (
                    <span
                      key={color}
                      className="h-1.5 flex-1 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>

    <Tabs defaultValue="colors">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="colors">
          <Palette />
          Colors
        </TabsTrigger>
        <TabsTrigger value="type">
          <Type />
          Type
        </TabsTrigger>
        <TabsTrigger value="layout">
          <LayoutTemplate />
          Layout
        </TabsTrigger>
      </TabsList>

      <TabsContent className="mt-3" value="colors">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {COLOR_FIELDS.map(({ key, label }) => (
            <ColorField
              key={key}
              label={label}
              onCommit={(value) => actions.setColor(key, value)}
              value={theme.colors[key]}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent className="mt-3 space-y-3" value="type">
        <Card className="gap-4 py-4 shadow-none">
          <CardHeader className="gap-1 px-4">
            <CardTitle className="text-sm">Body</CardTitle>
            <CardDescription className="text-xs">
              Base type used across paragraphs and tables.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <label
              className="grid gap-1.5 text-xs font-medium sm:col-span-2 lg:col-span-1 xl:col-span-2"
              htmlFor={`${idPrefix}-body-font`}
            >
              Font family
              <Select
                onValueChange={actions.setBodyFontFamily}
                value={theme.typography.body.fontFamily}
              >
                <SelectTrigger
                  className="h-8 w-full"
                  id={`${idPrefix}-body-font`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <NumberField
              label="Font size"
              max={18}
              min={8}
              onCommit={actions.setBodyFontSize}
              suffix="pt"
              value={theme.typography.body.fontSize}
            />
            <NumberField
              label="Line height"
              max={2.2}
              min={1}
              onCommit={actions.setBodyLineHeight}
              step={0.05}
              value={theme.typography.body.lineHeight}
            />
          </CardContent>
        </Card>

        <Card className="gap-4 py-4 shadow-none">
          <CardHeader className="gap-1 px-4">
            <CardTitle className="text-sm">Headings</CardTitle>
            <CardDescription className="text-xs">
              Display type, weight, and scale.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <label
              className="grid gap-1.5 text-xs font-medium sm:col-span-2 lg:col-span-1 xl:col-span-2"
              htmlFor={`${idPrefix}-heading-font`}
            >
              Font family
              <Select
                onValueChange={actions.setHeadingFontFamily}
                value={theme.typography.heading.fontFamily}
              >
                <SelectTrigger
                  className="h-8 w-full"
                  id={`${idPrefix}-heading-font`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label
              className="grid gap-1.5 text-xs font-medium"
              htmlFor={`${idPrefix}-heading-weight`}
            >
              Weight
              <Select
                onValueChange={(value) =>
                  actions.setHeadingFontWeight(Number(value))
                }
                value={String(theme.typography.heading.fontWeight)}
              >
                <SelectTrigger
                  className="h-8 w-full"
                  id={`${idPrefix}-heading-weight`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[400, 500, 600, 700].map((weight) => (
                    <SelectItem key={weight} value={String(weight)}>
                      {weight}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <NumberField
              label="Line height"
              max={2}
              min={1}
              onCommit={actions.setHeadingLineHeight}
              step={0.05}
              value={theme.typography.heading.lineHeight}
            />
            {HEADING_LEVELS.map((level) => (
              <NumberField
                key={level}
                label={level.toUpperCase()}
                max={64}
                min={8}
                onCommit={(value) =>
                  actions.setHeadingFontSize(level as HeadingLevel, value)
                }
                suffix="pt"
                value={theme.typography.heading.fontSize[level]}
              />
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent className="mt-3 space-y-3" value="layout">
        <Card className="gap-4 py-4 shadow-none">
          <CardHeader className="gap-1 px-4">
            <CardTitle className="text-sm">Page</CardTitle>
            <CardDescription className="text-xs">
              Paper format and reading direction.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 px-4">
            <label
              className="grid gap-1.5 text-xs font-medium"
              htmlFor={`${idPrefix}-page-size`}
            >
              Size
              <Select
                onValueChange={(value) =>
                  actions.setPageSize(value as PdfcnTheme["page"]["size"])
                }
                value={theme.page.size}
              >
                <SelectTrigger
                  className="h-8 w-full"
                  id={`${idPrefix}-page-size`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="LETTER">Letter</SelectItem>
                  <SelectItem value="LEGAL">Legal</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label
              className="grid gap-1.5 text-xs font-medium"
              htmlFor={`${idPrefix}-page-orientation`}
            >
              Orientation
              <Select
                onValueChange={(value) =>
                  actions.setPageOrientation(
                    value as PdfcnTheme["page"]["orientation"]
                  )
                }
                value={theme.page.orientation}
              >
                <SelectTrigger
                  className="h-8 w-full capitalize"
                  id={`${idPrefix}-page-orientation`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </CardContent>
        </Card>

        <Card className="gap-4 py-4 shadow-none">
          <CardHeader className="gap-1 px-4">
            <CardTitle className="text-sm">Margins</CardTitle>
            <CardDescription className="text-xs">
              Space between content and every page edge.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 px-4">
            {(
              [
                ["marginTop", "Top"],
                ["marginRight", "Right"],
                ["marginBottom", "Bottom"],
                ["marginLeft", "Left"],
              ] as const satisfies readonly [PageMargin, string][]
            ).map(([edge, label]) => (
              <NumberField
                key={edge}
                label={label}
                max={120}
                min={0}
                onCommit={(value) => actions.setPageMargin(edge, value)}
                suffix="pt"
                value={theme.spacing.page[edge]}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="gap-4 py-4 shadow-none">
          <CardHeader className="gap-1 px-4">
            <CardTitle className="text-sm">Rhythm</CardTitle>
            <CardDescription className="text-xs">
              Vertical spacing between document elements.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 px-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {(
              [
                ["sectionGap", "Sections"],
                ["paragraphGap", "Paragraphs"],
                ["componentGap", "Components"],
              ] as const satisfies readonly [SpacingTokenName, string][]
            ).map(([key, label]) => (
              <NumberField
                key={key}
                label={label}
                max={80}
                min={0}
                onCommit={(value) => actions.setSpacing(key, value)}
                suffix="pt"
                value={theme.spacing[key]}
              />
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);
