import { blueprintTheme } from "./blueprint";
import { corporateTheme } from "./corporate";
import { elegantTheme } from "./elegant";
import { executiveTheme } from "./executive";
import { forestTheme } from "./forest";
import { minimalTheme } from "./minimal";
import { modernTheme } from "./modern";
import { professionalTheme } from "./professional";
import { vividTheme } from "./vivid";

export { defaultPrimitives } from "./primitives";
export { professionalTheme } from "./professional";
export { modernTheme } from "./modern";
export { minimalTheme } from "./minimal";
export { executiveTheme } from "./executive";
export { corporateTheme } from "./corporate";
export { elegantTheme } from "./elegant";
export { vividTheme } from "./vivid";
export { forestTheme } from "./forest";
export { blueprintTheme } from "./blueprint";

/** Map of all built-in theme presets */
export const themePresets = {
  blueprint: blueprintTheme,
  corporate: corporateTheme,
  elegant: elegantTheme,
  executive: executiveTheme,
  forest: forestTheme,
  minimal: minimalTheme,
  modern: modernTheme,
  professional: professionalTheme,
  vivid: vividTheme,
} as const;

/** Valid theme preset names */
export type ThemePresetName = keyof typeof themePresets;
