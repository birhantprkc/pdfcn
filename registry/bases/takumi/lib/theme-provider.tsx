/* eslint-disable react-refresh/only-export-components */
// Exports both a component (PdfcnThemeProvider) and theme helpers intentionally.
// All PDF components import from a single file — splitting would break the public API.

import { isValidElement } from "react";
import type { DependencyList, ReactNode } from "react";

import { theme as defaultTheme } from "./pdfcn-theme";

export type PdfcnTheme = typeof defaultTheme;

let serializedTheme = defaultTheme;

export interface PdfcnThemeProviderProps {
  theme?: PdfcnTheme;
  children: ReactNode;
}

/**
 * Takumi converts function components directly instead of mounting a React
 * tree. Resolve the provider's child so the converter receives PDF markup.
 */
const renderForSerializer = (
  children: ReactNode,
  theme: PdfcnTheme
): ReactNode => {
  serializedTheme = theme;

  if (!isValidElement(children) || typeof children.type !== "function") {
    return children;
  }

  return (children.type as (props: unknown) => ReactNode)(children.props);
};

export const PdfcnThemeProvider = ({
  theme,
  children,
}: PdfcnThemeProviderProps) =>
  renderForSerializer(children, theme ?? defaultTheme);

/** Returns the theme selected by the nearest serialized provider. */
export const usePdfcnTheme = (): PdfcnTheme => serializedTheme;

/**
 * Calls factory() and returns the result.
 * The deps parameter is accepted for API compatibility with existing callers.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSafeMemo = <T,>(factory: () => T, _deps: DependencyList): T =>
  factory();
