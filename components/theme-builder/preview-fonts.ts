import type { FormeFont } from "@formepdf/react";

const FONT_CDN = "https://cdn.jsdelivr.net/npm/@fontsource";

interface FontFace {
  italic?: boolean;
  weight: number;
}

interface GoogleFontDefinition {
  fileFamily: string;
  packageName: string;
}

const GOOGLE_FONT_FACES: Record<string, FontFace[]> = {
  Inter: [{ weight: 400 }, { weight: 500 }, { weight: 600 }, { weight: 700 }],
  "JetBrains Mono": [{ weight: 400 }, { weight: 700 }],
  Lato: [{ weight: 400 }, { weight: 700 }],
  Lora: [{ weight: 400 }, { weight: 700 }],
  Merriweather: [{ weight: 400 }, { weight: 700 }],
  Nunito: [{ weight: 400 }, { weight: 600 }, { weight: 700 }],
  "Open Sans": [{ weight: 400 }, { weight: 600 }, { weight: 700 }],
  "Playfair Display": [{ weight: 400 }, { weight: 700 }],
  "Source Code Pro": [{ weight: 400 }, { weight: 700 }],
};

const GOOGLE_FONT_PACKAGES: Record<string, GoogleFontDefinition> =
  Object.fromEntries(
    Object.keys(GOOGLE_FONT_FACES).map((family) => [
      family,
      {
        fileFamily: family.toLowerCase().replaceAll(" ", "-"),
        packageName: family.toLowerCase().replaceAll(" ", "-"),
      },
    ])
  );

export const getPreviewFonts = (families: (string | undefined)[]) => {
  const fonts: FormeFont[] = [];

  for (const family of families) {
    const definition = family ? GOOGLE_FONT_PACKAGES[family] : undefined;
    if (!definition || !family) {
      continue;
    }

    for (const { italic, weight } of GOOGLE_FONT_FACES[family]) {
      fonts.push({
        family,
        italic: italic ?? false,
        src: `${FONT_CDN}/${definition.packageName}@4/files/${definition.fileFamily}-latin-${weight}-${italic ? "italic" : "normal"}.woff`,
        weight,
      });
    }
  }

  return fonts;
};

export const getRemoteFontFamilies = (families: (string | undefined)[]) =>
  [...new Set(families)].filter(
    (family): family is string =>
      family !== undefined && family in GOOGLE_FONT_PACKAGES
  );

export const getPreviewFontUrls = (families: (string | undefined)[]) => {
  const urls: string[] = [];

  for (const family of families) {
    const definition = family ? GOOGLE_FONT_PACKAGES[family] : undefined;
    if (!definition || !family) {
      continue;
    }

    for (const { weight } of GOOGLE_FONT_FACES[family]) {
      urls.push(
        `${FONT_CDN}/${definition.packageName}@4/files/${definition.fileFamily}-latin-${weight}-normal.woff2`
      );
    }
  }

  return urls;
};
