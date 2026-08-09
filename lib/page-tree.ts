import type {
  Node as PageTreeNode,
  Root as PageTreeRoot,
} from "fumadocs-core/page-tree";

import { ROUTES } from "@/constants/routes";
import {
  EXCLUDED_SECTIONS,
  isBlocksFolder,
  isComponentsFolder,
} from "@/lib/docs";
import { DEFAULT_BASE } from "@/registry/bases";

export type PageTreeFolder = Extract<PageTreeNode, { type: "folder" }>;
export type PageTreePage = Extract<PageTreeNode, { type: "page" }>;

export interface TreeGroup {
  label: string;
  pages: PageTreePage[];
}

export const getAllPagesFromFolder = (
  folder: PageTreeFolder
): PageTreePage[] => {
  const pages: PageTreePage[] = [];

  for (const child of folder.children) {
    if (child.type === "page") {
      pages.push(child);
    } else if (child.type === "folder") {
      pages.push(...getAllPagesFromFolder(child));
    }
  }

  return pages;
};

export const getPagesFromFolder = (folder: PageTreeFolder): PageTreePage[] =>
  folder.children.filter(
    (child): child is PageTreePage => child.type === "page"
  );

const matchesBase = (folder: PageTreeFolder, base: string): boolean =>
  folder.$id === base ||
  String(folder.$id ?? "").endsWith(`/${base}`) ||
  (typeof folder.name === "string" &&
    folder.name.toLowerCase() === base.toLowerCase());

export const findBaseFolder = (
  folder: PageTreeFolder,
  base: string
): PageTreeFolder | undefined => {
  for (const child of folder.children) {
    if (child.type !== "folder") {
      continue;
    }
    if (matchesBase(child, base)) {
      return child;
    }
  }
};

export const getCategoryFolders = (
  folder: PageTreeFolder,
  base: string
): PageTreeFolder[] => {
  const baseFolder = findBaseFolder(folder, base);
  if (!baseFolder) {
    return [];
  }

  return baseFolder.children.filter(
    (c): c is PageTreeFolder => c.type === "folder"
  );
};

export const getFolderPages = (
  folder: PageTreeFolder,
  base?: string
): PageTreePage[] => {
  if (base) {
    const baseFolder = findBaseFolder(folder, base);
    if (!baseFolder) {
      return [];
    }

    return getAllPagesFromFolder(baseFolder);
  }

  return getAllPagesFromFolder(folder);
};

export const getCurrentBase = (pathname: string): string => {
  const baseScopedMatch = pathname.match(
    /\/docs\/(?:components|blocks)\/([^/]+)(?:\/|$)/
  );
  if (baseScopedMatch) {
    return baseScopedMatch[1];
  }

  return DEFAULT_BASE;
};

export const getTreeGroups = (
  tree: PageTreeRoot,
  currentBase: string
): TreeGroup[] => {
  const groups: TreeGroup[] = [];

  for (const item of tree.children) {
    if (item.type !== "folder") {
      continue;
    }
    if (EXCLUDED_SECTIONS.has(item.$id ?? "")) {
      continue;
    }

    if (isComponentsFolder(item)) {
      // Check if there are base folders (takumi, forme)
      const baseFolder = findBaseFolder(item, currentBase);
      if (baseFolder) {
        // Get pages from the base folder
        const pages = getAllPagesFromFolder(baseFolder).filter(
          (page) =>
            page.url !== ROUTES.DOCS_COMPONENTS &&
            page.url !== `${ROUTES.DOCS_COMPONENTS}/${currentBase}`
        );
        if (pages.length > 0) {
          groups.push({
            label: "Components",
            pages,
          });
        }
      } else {
        // No base folder found, get all pages from components folder
        const pages = getAllPagesFromFolder(item).filter(
          (page) => page.url !== ROUTES.DOCS_COMPONENTS
        );
        if (pages.length > 0) {
          groups.push({
            label: "Components",
            pages,
          });
        }
      }
    } else if (isBlocksFolder(item)) {
      const pages = getFolderPages(item, currentBase).filter(
        (page) =>
          page.url !== ROUTES.DOCS_BLOCKS &&
          page.url !== `${ROUTES.DOCS_BLOCKS}/${currentBase}`
      );
      if (pages.length > 0) {
        groups.push({
          label: typeof item.name === "string" ? item.name : String(item.name),
          pages,
        });
      }
    } else {
      const pages = getFolderPages(item);
      if (pages.length > 0) {
        groups.push({
          label: typeof item.name === "string" ? item.name : String(item.name),
          pages,
        });
      }
    }
  }

  return groups;
};
