import { z } from "zod";

import type { PdfcnTheme, ThemePresetName } from "@/registry/themes";
import { themePresets } from "@/registry/themes";

const STORAGE_KEY = "pdfcn-theme-builder";
const HASH_KEY = "theme";
const PRESET_NAMES = Object.keys(themePresets) as [
  ThemePresetName,
  ...ThemePresetName[],
];

const finiteNumber = z.number().finite();
const hexColor = z.string().regex(/^#[\da-f]{6}$/i);
const ThemeSchema: z.ZodType<PdfcnTheme> = z.object({
  colors: z.object({
    accent: hexColor,
    background: hexColor,
    border: hexColor,
    destructive: hexColor,
    foreground: hexColor,
    info: hexColor,
    muted: hexColor,
    mutedForeground: hexColor,
    primary: hexColor,
    primaryForeground: hexColor,
    success: hexColor,
    warning: hexColor,
  }),
  name: z.string(),
  page: z.object({
    orientation: z.enum(["portrait", "landscape"]),
    size: z.enum(["A4", "LETTER", "LEGAL"]),
  }),
  primitives: z.object({
    borderRadius: z.object({
      full: finiteNumber,
      lg: finiteNumber,
      md: finiteNumber,
      none: finiteNumber,
      sm: finiteNumber,
    }),
    fontWeights: z.object({
      bold: finiteNumber,
      medium: finiteNumber,
      regular: finiteNumber,
      semibold: finiteNumber,
    }),
    letterSpacing: z.object({
      normal: finiteNumber,
      tight: finiteNumber,
      wide: finiteNumber,
      wider: finiteNumber,
    }),
    lineHeights: z.object({
      normal: finiteNumber,
      relaxed: finiteNumber,
      tight: finiteNumber,
    }),
    spacing: z.object({
      0: finiteNumber,
      0.5: finiteNumber,
      1: finiteNumber,
      10: finiteNumber,
      12: finiteNumber,
      16: finiteNumber,
      2: finiteNumber,
      3: finiteNumber,
      4: finiteNumber,
      5: finiteNumber,
      6: finiteNumber,
      8: finiteNumber,
    }),
    typography: z.object({
      "2xl": finiteNumber,
      "3xl": finiteNumber,
      base: finiteNumber,
      lg: finiteNumber,
      sm: finiteNumber,
      xl: finiteNumber,
      xs: finiteNumber,
    }),
  }),
  spacing: z.object({
    componentGap: finiteNumber,
    page: z.object({
      marginBottom: finiteNumber,
      marginLeft: finiteNumber,
      marginRight: finiteNumber,
      marginTop: finiteNumber,
    }),
    paragraphGap: finiteNumber,
    sectionGap: finiteNumber,
  }),
  typography: z.object({
    body: z.object({
      fontFamily: z.string(),
      fontSize: finiteNumber,
      lineHeight: finiteNumber,
    }),
    heading: z.object({
      fontFamily: z.string(),
      fontSize: z.object({
        h1: finiteNumber,
        h2: finiteNumber,
        h3: finiteNumber,
        h4: finiteNumber,
        h5: finiteNumber,
        h6: finiteNumber,
      }),
      fontWeight: finiteNumber,
      lineHeight: finiteNumber,
    }),
  }),
});

const StoredThemeStateSchema = z.object({
  basePreset: z.enum(PRESET_NAMES),
  theme: ThemeSchema,
});

export type StoredThemeState = z.infer<typeof StoredThemeStateSchema>;

const parseThemeState = (value: string | null): StoredThemeState | null => {
  if (!value) {
    return null;
  }

  try {
    const result = StoredThemeStateSchema.safeParse(JSON.parse(value));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const readThemeState = (): StoredThemeState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const hashValue = new URLSearchParams(window.location.hash.slice(1)).get(
    HASH_KEY
  );
  if (hashValue) {
    return parseThemeState(hashValue);
  }

  try {
    return parseThemeState(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export const writeThemeState = (state: StoredThemeState) => {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(state);
  const url = new URL(window.location.href);
  url.hash = new URLSearchParams({ [HASH_KEY]: serialized }).toString();
  window.history.replaceState(null, "", url);

  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // The shareable URL remains the source of truth when storage is unavailable.
  }
};
