import { z } from "zod";

import { BASE_NAMES, BASES, DEFAULT_BASE } from "@/registry/bases";
import type { Base, BaseName } from "@/registry/bases";
import { THEME_NAMES, THEMES } from "@/registry/themes";
import type { RegistryTheme, RegistryThemeName } from "@/registry/themes";

export { BASES, type Base, type BaseName, DEFAULT_BASE };
export { THEMES, type RegistryTheme, type RegistryThemeName };

export const registryConfigSchema = z.object({
  base: z.enum(BASE_NAMES).default(DEFAULT_BASE),
  theme: z.enum(THEME_NAMES).default("professional"),
});

export type RegistryConfig = z.infer<typeof registryConfigSchema>;

export const DEFAULT_REGISTRY_CONFIG: RegistryConfig = {
  base: DEFAULT_BASE,
  theme: "professional",
};

export const getRegistryConfig = (config?: Partial<RegistryConfig>) =>
  registryConfigSchema.parse(config ?? {});
