import { themePresets } from "@/registry/themes";
import type { ThemePresetName } from "@/registry/themes";

export const THEMES = Object.entries(themePresets).map(([name, theme]) => ({
  name: name as ThemePresetName,
  theme,
  title: name.charAt(0).toUpperCase() + name.slice(1),
}));

export type RegistryTheme = (typeof THEMES)[number];
export type RegistryThemeName = RegistryTheme["name"];

export const THEME_NAMES = THEMES.map((t) => t.name) as [
  RegistryThemeName,
  ...RegistryThemeName[],
];

export const getTheme = (name: RegistryThemeName) =>
  THEMES.find((t) => t.name === name);
