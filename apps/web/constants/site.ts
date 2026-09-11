export const FALLBACK_SITE_ORIGIN = "https://pdfcn.dev" as const;

const getBaseUrl = () => {
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return process.env.SITE_URL ?? FALLBACK_SITE_ORIGIN;
};

const baseUrl = getBaseUrl();

export const SITE = {
  AUTHOR: {
    NAME: "Aniket Pawar",
    TWITTER: "@alaymanguy",
  },
  DESCRIPTION: {
    LONG: "A collection of beautifully designed, accessible, and customizable PDF components. Built on Takumi and Forme. Works with shadcn/ui.",
    SHORT: "Beautiful PDFs, made simple",
  },
  KEYWORDS: [
    "shadcn",
    "shadcn registry",
    "pdf components",
    "takumi-pdf",
    "forme",
    "react pdf",
    "npx shadcn add",
  ] as const,
  NAME: "pdfcn",
  OG_IMAGE: `${baseUrl}/og.png`,
  REGISTRY: "@pdfcn",
  URL: baseUrl,
};

export const META_THEME_COLORS = {
  dark: "#09090b",
  light: "#ffffff",
};

export const UTM_PARAMS = {
  SOURCE: {
    utm_source: new URL(baseUrl).hostname,
  },
  SPONSOR: {
    utm_campaign: "sponsors_page",
    utm_medium: "sponsor",
  },
};
