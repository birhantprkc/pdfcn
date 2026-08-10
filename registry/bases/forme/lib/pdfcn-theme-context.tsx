/* eslint-disable react-refresh/only-export-components */
// Exports both a component (PdfcnThemeProvider) and theme helpers intentionally.
// All PDF components import from a single file — splitting would break the public API.

import type { Style } from "@formepdf/react";
import { isValidElement } from "react";
import type { DependencyList, ReactNode } from "react";

import { theme as defaultTheme } from "./pdfcn-theme";

export type PdfcnTheme = typeof defaultTheme;

let serializedTheme = defaultTheme;

export interface PdfcnThemeProviderProps {
  theme?: PdfcnTheme;
  children: ReactNode;
}

type PdfStyleInput = Style | PdfStyleInput[] | false | null | undefined;

const mergeStyleInput = (target: Style, input: PdfStyleInput): void => {
  if (Array.isArray(input)) {
    for (const item of input) {
      mergeStyleInput(target, item);
    }
  } else if (input) {
    Object.assign(target, input);
  }
};

/** Flattens React-PDF-style arrays into the object Forme serializes. */
export const mergePdfStyles = (...inputs: PdfStyleInput[]): Style => {
  const merged: Style = {};
  for (const input of inputs) {
    mergeStyleInput(merged, input);
  }
  return merged;
};

/**
 * Forme serializes function components directly instead of mounting a React
 * tree. Resolve the provider's child so <Document> remains the top-level node.
 */
const renderForSerializer = (
  children: ReactNode,
  theme: PdfcnTheme
): ReactNode => {
  serializedTheme = theme;

  if (!isValidElement(children) || typeof children.type !== "function") {
    return children;
  }
  if ((children.type as { __formeType?: string }).__formeType === "Document") {
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
