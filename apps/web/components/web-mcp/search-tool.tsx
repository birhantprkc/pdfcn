"use client";

import { useWebMCP } from "use-webmcp-tool";

import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

interface RegistryItem {
  name: string;
  title: string;
  description: string;
  type: string;
}

let cachedRegistry: RegistryItem[] | null = null;

const fetchRegistry = async (): Promise<RegistryItem[]> => {
  if (cachedRegistry) {
    return cachedRegistry;
  }
  const res = await fetch(`${window.location.origin}${ROUTES.REGISTRY}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry: ${res.status}`);
  }
  const data = await res.json();
  cachedRegistry = (data.items ?? []) as RegistryItem[];
  return cachedRegistry;
};

export const SearchComponentsTool = () => {
  useWebMCP({
    annotations: {
      readOnlyHint: true,
    },
    description:
      "Search the pdfcn component registry by name or description. Returns matching components, blocks, themes, and utilities with install commands.",
    execute: async ({
      query,
      type = "all",
    }: {
      query: string;
      type?: string;
    }) => {
      const items = await fetchRegistry();
      const q = query.toLowerCase();

      const matches = items.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const titleMatch = item.title?.toLowerCase().includes(q);
        return nameMatch || descMatch || titleMatch;
      });

      const typeMap: Record<string, string> = {
        block: "registry:block",
        lib: "registry:lib",
        theme: "registry:theme",
        ui: "registry:ui",
      };
      const typeFiltered =
        type === "all"
          ? matches
          : matches.filter((item) => item.type === typeMap[type]);

      return typeFiltered.map((item) => ({
        description: item.description,
        installCommand: `npx shadcn@latest add "https://pdfcn.vercel.app/r/${item.name}.json"`,
        name: item.name,
        title: item.title,
        type: item.type,
      }));
    },
    inputSchema: {
      properties: {
        query: {
          description:
            "Search query (fuzzy match against component names and descriptions)",
          type: "string",
        },
        type: {
          description: "Filter by item type (default: all)",
          enum: ["ui", "block", "theme", "lib", "all"],
          type: "string",
        },
      },
      required: ["query"],
      type: "object",
    },
    name: `${SITE.NAME}_search_components`,
  });

  return null;
};
