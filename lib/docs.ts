import { ROUTES } from "@/constants/routes";
import type { PageTreeFolder } from "@/lib/page-tree";
import { formatLabelFromSlug } from "@/lib/utils";

export const DOCS_DIR = `content${ROUTES.DOCS}`;

export const EXCLUDED_SECTIONS = new Set(["installation", "(root)"]);

export const isComponentsFolder = (folder: PageTreeFolder) =>
  folder.$id === "components" || folder.name === "Components";

export const isBlocksFolder = (folder: PageTreeFolder) =>
  folder.$id === "blocks" || folder.name === "Blocks";

export type DocsSidebarPanel = "components" | "blocks";

const isPathWithin = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export const getDocsSidebarPanel = (
  pathname: string
): DocsSidebarPanel | null => {
  if (isPathWithin(pathname, ROUTES.DOCS_COMPONENTS)) {
    return "components";
  }
  if (isPathWithin(pathname, ROUTES.DOCS_BLOCKS)) {
    return "blocks";
  }
  return null;
};

const TITLE_OVERRIDES: Record<string, string> = {
  json: "JSON",
  "qr-code": "QR Code",
};

export const formatTitleFromSlug = (slug: string): string =>
  TITLE_OVERRIDES[slug] ?? formatLabelFromSlug(slug);

export const homeContentRoute = `${ROUTES.LLMS_MD}/content.md`;
export const docsContentRoute = `${ROUTES.LLMS_MD}${ROUTES.DOCS}`;
export const docsImageRoute = `${ROUTES.OG}${ROUTES.DOCS}`;
