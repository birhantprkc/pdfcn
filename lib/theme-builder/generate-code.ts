import type { PdfcnTheme, ThemePresetName } from "@/registry/themes";
import { themePresets } from "@/registry/themes";

type Json = boolean | Json[] | null | number | string | { [key: string]: Json };

const deepDiff = (base: Json, next: Json): Json | undefined => {
  if (Array.isArray(base) || Array.isArray(next)) {
    return JSON.stringify(base) === JSON.stringify(next) ? undefined : next;
  }

  if (
    base !== null &&
    next !== null &&
    typeof base === "object" &&
    typeof next === "object"
  ) {
    const result: Record<string, Json> = {};

    for (const key of Object.keys(next)) {
      const delta = deepDiff(base[key], next[key]);
      if (delta !== undefined) {
        result[key] = delta;
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  return base === next ? undefined : next;
};

export const generateThemeCode = (theme: PdfcnTheme) =>
  `import type { PdfcnTheme } from "@/registry/themes";\n\nexport const customTheme: PdfcnTheme = ${JSON.stringify(theme, null, 2)};\n`;

export const generateDeltaCode = (
  theme: PdfcnTheme,
  basePreset: ThemePresetName
) => {
  const overrides = deepDiff(
    themePresets[basePreset] as unknown as Json,
    theme as unknown as Json
  );

  return `// Spread this over the '${basePreset}' preset:\nconst overrides = ${JSON.stringify(overrides ?? {}, null, 2)};\n`;
};
