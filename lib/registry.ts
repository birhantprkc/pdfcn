import path from "node:path";

import { readFileFromRoot } from "@/lib/read-file";
import type { BaseName } from "@/registry/bases";

export const readOptionalFromRoot = async (
  relativePath: string
): Promise<string | null> => {
  try {
    return await readFileFromRoot(relativePath);
  } catch {
    return null;
  }
};

export const getRegistryUiSourceCandidates = ({
  name,
  base = "takumi",
}: {
  name: string;
  base?: BaseName;
}) => {
  const slug = name.includes("/") ? (name.split("/").pop() ?? name) : name;
  return [
    path.join("registry", "bases", base, "components", slug, `${slug}.tsx`),
    path.join("registry", "bases", base, "blocks", slug, `${slug}.tsx`),
  ];
};

export const getDemoSource = (
  name: string,
  base: BaseName = "takumi"
): Promise<string | null> =>
  readOptionalFromRoot(path.join("examples", base, `${name}.tsx`));

export const getRegistrySource = async (
  name: string,
  base: BaseName = "takumi"
): Promise<string | null> => {
  const candidates = getRegistryUiSourceCandidates({ base, name });

  for (const candidate of candidates) {
    const code = await readOptionalFromRoot(candidate);
    if (code) {
      return code;
    }
  }

  return null;
};
