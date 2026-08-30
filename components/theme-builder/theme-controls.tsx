"use client";

import { LayoutTemplate, Palette, Shuffle, Type } from "lucide-react";
import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PdfcnTheme, ThemePresetName } from "@/registry/themes";
import { THEMES } from "@/registry/themes";

import { ThemePicker } from "./theme-picker";
import type {
  ColorTokenName,
  HeadingLevel,
  PageMargin,
  SpacingTokenName,
  ThemeBuilderActions,
} from "./use-theme-builder";

const COLOR_FIELDS = [
  { description: "Primary text", key: "foreground", label: "Foreground" },
  { description: "Page background", key: "background", label: "Background" },
  { description: "Brand emphasis", key: "primary", label: "Primary" },
  {
    description: "Text on primary",
    key: "primaryForeground",
    label: "Primary foreground",
  },
  { description: "Secondary fill", key: "muted", label: "Muted" },
  {
    description: "Captions, footnotes",
    key: "mutedForeground",
    label: "Muted foreground",
  },
  { description: "Links, highlights", key: "accent", label: "Accent" },
  { description: "Dividers, table lines", key: "border", label: "Border" },
  { description: "Errors", key: "destructive", label: "Destructive" },
  { description: "Success states", key: "success", label: "Success" },
  { description: "Warning states", key: "warning", label: "Warning" },
  { description: "Info states", key: "info", label: "Info" },
] as const satisfies readonly {
  key: ColorTokenName;
  label: string;
  description: string;
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
  description: string;
  label: string;
  onCommit: (value: string) => void;
  value: string;
}

const ColorField = ({
  description,
  label,
  onCommit,
  value,
}: ColorFieldProps) => (
  <div className="flex items-center gap-3">
    <div className="min-w-0 flex-1">
      <span className="block truncate text-xs font-medium">{label}</span>
      <span className="block truncate text-[10px] text-muted-foreground">
        {description}
      </span>
    </div>
    <Input
      aria-label={`Choose ${label.toLowerCase()} color`}
      className="size-8 shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0.5 shadow-none"
      onChange={(event) => onCommit(event.currentTarget.value)}
      type="color"
      value={value}
    />
    <Input
      key={`${label}-${value}`}
      aria-label={`${label} hex value`}
      className="h-8 w-[5.5rem] shrink-0 px-2 font-mono text-[11px] uppercase"
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
  </div>
);

interface SectionProps {
  children: React.ReactNode;
  description: string;
  title: string;
}

const Section = ({ children, description, title }: SectionProps) => (
  <div>
    <div className="mb-3 space-y-0.5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    {children}
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
  <div className={cn("space-y-4 py-4", className)}>
    <div className="space-y-3 border-b px-6 pb-4">
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

      <div className="flex items-center gap-1.5">
        <ThemePicker
          onThemeSelect={(name) => actions.loadPreset(name)}
          selectedTheme={basePreset}
        />
        <Button
          aria-label="Pick a random preset"
          onClick={() => {
            const others = THEMES.filter(({ name }) => name !== basePreset);
            const next = others[Math.floor(Math.random() * others.length)];
            if (next) {
              actions.loadPreset(next.name);
            }
          }}
          size="icon-sm"
          title="Pick a random preset"
          variant="outline"
        >
          <Shuffle />
        </Button>
      </div>
    </div>

    <Tabs className="gap-4 px-6" defaultValue="colors">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="colors">
          <Palette />
          Colors
        </TabsTrigger>
        <TabsTrigger value="typography">
          <Type />
          Typography
        </TabsTrigger>
        <TabsTrigger value="layout">
          <LayoutTemplate />
          Layout
        </TabsTrigger>
      </TabsList>

      <TabsContent value="colors">
        {COLOR_FIELDS.map(({ key, label, description }, index) => (
          <Fragment key={key}>
            {index > 0 ? <Separator className="my-3" /> : null}
            <ColorField
              description={description}
              label={label}
              onCommit={(value) => actions.setColor(key, value)}
              value={theme.colors[key]}
            />
          </Fragment>
        ))}
      </TabsContent>

      <TabsContent value="typography">
        <Section
          description="Base type used across paragraphs and tables."
          title="Body"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
                  className="w-full"
                  id={`${idPrefix}-body-font`}
                  size="sm"
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
          </div>
        </Section>

        <Separator className="my-4" />

        <Section
          description="Display type, weight, and scale."
          title="Headings"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
                  className="w-full"
                  id={`${idPrefix}-heading-font`}
                  size="sm"
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
                  className="w-full"
                  id={`${idPrefix}-heading-weight`}
                  size="sm"
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
          </div>
        </Section>
      </TabsContent>

      <TabsContent value="layout">
        <Section description="Paper format and reading direction." title="Page">
          <div className="grid grid-cols-2 gap-3">
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
                  className="w-full"
                  id={`${idPrefix}-page-size`}
                  size="sm"
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
                  className="w-full capitalize"
                  id={`${idPrefix}-page-orientation`}
                  size="sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>
        </Section>

        <Separator className="my-4" />

        <Section
          description="Space between content and every page edge."
          title="Margins"
        >
          <div className="grid grid-cols-2 gap-3">
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
          </div>
        </Section>

        <Separator className="my-4" />

        <Section
          description="Vertical spacing between document elements."
          title="Rhythm"
        >
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
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
          </div>
        </Section>
      </TabsContent>
    </Tabs>
  </div>
);
