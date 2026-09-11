import { z } from "zod";

import type { PdfcnTheme, ThemePresetName } from "@/registry/themes";
import { themePresets } from "@/registry/themes";

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

export const StoredThemeStateSchema = z.object({
  basePreset: z.enum(PRESET_NAMES),
  theme: ThemeSchema,
});

export type StoredThemeState = z.infer<typeof StoredThemeStateSchema>;

const readFromLocalStorage = (storageKey: string): StoredThemeState | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }
    const result = StoredThemeStateSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

const writeToLocalStorage = (storageKey: string, state: StoredThemeState) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Storage unavailable — URL is still the source of truth.
  }
};

const serializeTheme = (state: StoredThemeState): string =>
  btoa(encodeURIComponent(JSON.stringify(state)));

const deserializeTheme = (encoded: string): StoredThemeState | null => {
  try {
    const json = decodeURIComponent(atob(encoded));
    const result = StoredThemeStateSchema.safeParse(JSON.parse(json));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const readThemeState = (storageKey: string): StoredThemeState | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const encoded = params.get("theme");
  if (encoded) {
    const fromUrl = deserializeTheme(encoded);
    if (fromUrl) {
      writeToLocalStorage(storageKey, fromUrl);
      return fromUrl;
    }
  }
  return readFromLocalStorage(storageKey);
};

export const writeThemeState = (
  storageKey: string,
  state: StoredThemeState
) => {
  if (typeof window === "undefined") {
    return;
  }
  writeToLocalStorage(storageKey, state);
  const encoded = serializeTheme(state);
  const url = new URL(window.location.href);
  url.hash = `theme=${encoded}`;
  window.history.replaceState(null, "", url.toString());
};
