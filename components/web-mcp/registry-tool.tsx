"use client";

import { useWebMCP } from "use-webmcp-tool";

import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

export const FetchRegistryTool = () => {
  useWebMCP({
    annotations: {
      readOnlyHint: true,
    },
    description:
      "Fetch the full shadcn registry manifest for pdfcn. Returns all available components, blocks, themes, and utilities with their file structures and dependencies.",
    execute: async () => {
      const res = await fetch(`${window.location.origin}${ROUTES.REGISTRY}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch registry: ${res.status}`);
      }
      return res.json();
    },
    inputSchema: {
      properties: {},
      type: "object",
    },
    name: `${SITE.NAME}_fetch_registry`,
  });

  return null;
};
