export const FALLBACK_SITE_ORIGIN = "https://pdfcn.vercel.app" as const;

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
    LONG: "A shadcn registry of PDF components for Takumi PDF and Forme PDF — invoices, reports, tables, and primitives with live PDF preview.",
    SHORT: "PDF component registry for Takumi and Forme",
  },
  KEYWORDS: [
    "shadcn",
    "shadcn registry",
    "pdf components",
    "takumi-pdf",
    "forme pdf",
    "react pdf",
    "npx shadcn add",
  ] as const,
  NAME: "pdfcn",
  OG_IMAGE: `${baseUrl}/og`,
  REGISTRY: baseUrl,
  URL: baseUrl,
};

export const META_THEME_COLORS = {
  dark: "#09090b",
  light: "#ffffff",
};

export const UTM_PARAMS = {
  utm_source: new URL(baseUrl).hostname,
};
