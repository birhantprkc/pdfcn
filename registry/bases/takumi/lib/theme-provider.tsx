import { isValidElement } from "react";
import type { DependencyList, ReactNode } from "react";

import { theme as defaultTheme } from "@/registry/bases/takumi/lib/pdfcn-theme";

export type PdfcnTheme = typeof defaultTheme;

let serializedTheme = defaultTheme;

export interface PdfcnThemeProviderProps {
  theme?: PdfcnTheme;
  children: ReactNode;
}

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

export const usePdfcnTheme = (): PdfcnTheme => serializedTheme;

export const useSafeMemo = <T,>(factory: () => T, _deps: DependencyList): T =>
  factory();
