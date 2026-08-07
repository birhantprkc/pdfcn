import type { PDFComponentProps, PdfcnTheme } from "@/registry/themes";

import { usePdfcnTheme, useSafeMemo } from "../../lib/pdfcn-theme-context";
import { View, Text as PDFText, StyleSheet } from "../../lib/takumi-primitives";
import type { Style } from "../../lib/takumi-primitives";

export type PageNumberAlign = "left" | "center" | "right";
export type PageNumberSize = "xs" | "sm" | "md";

/**
 * Auto page number rendered with a configurable format string at a or inline position.
 * Props - `format` | `align` | `size` | `fixed` | `muted` | `style`
 * @see {@link PdfPageNumberProps}
 */
export interface PdfPageNumberProps extends Omit<
  PDFComponentProps,
  "children"
> {
  /**
   * Format string — use `{page}` for current page and `{total}` for total page count.
   * @default 'Page {page} of {total}'
   */
  format?: string;
  /**
   * @default 'center'
   */
  align?: PageNumberAlign;
  /**
   * @default 'sm'
   */
  size?: PageNumberSize;
  /**
   * @default false
   */
  fixed?: boolean;
  /**
   * @default true
   */
  muted?: boolean;
  children?: never;
}

function createPageNumberStyles(t: PdfcnTheme) {
  const { typography, colors, primitives } = t;
  return StyleSheet.create({
    alignCenter: { textAlign: "center" },
    alignLeft: { textAlign: "left" },
    alignRight: { textAlign: "right" },
    colorForeground: { color: colors.foreground },
    colorMuted: { color: colors.mutedForeground },
    container: { width: "100%" },
    sizeMd: { fontSize: primitives.typography.base },
    sizeSm: { fontSize: primitives.typography.sm },
    sizeXs: { fontSize: primitives.typography.xs },
    text: { fontFamily: typography.body.fontFamily },
  });
}

function formatPageNumber(
  format: string,
  pageNumber: number,
  totalPages: number
): string {
  return format
    .replace("{page}", String(pageNumber))
    .replace("{total}", String(totalPages));
}

export function PdfPageNumber({
  format = "Page {page} of {total}",
  align = "center",
  size = "sm",
  fixed = false,
  muted = true,
  style,
}: PdfPageNumberProps) {
  const theme = usePdfcnTheme();
  const styles = useSafeMemo(() => createPageNumberStyles(theme), [theme]);
  const alignMap = {
    center: styles.alignCenter,
    left: styles.alignLeft,
    right: styles.alignRight,
  } as Record<PageNumberAlign, Style>;
  const sizeMap = {
    md: styles.sizeMd,
    sm: styles.sizeSm,
    xs: styles.sizeXs,
  } as Record<PageNumberSize, Style>;
  const textStyles: Style[] = [
    styles.text,
    alignMap[align],
    sizeMap[size],
    muted ? styles.colorMuted : styles.colorForeground,
  ];
  if (style) {
    textStyles.push(...[style].flat());
  }
  return (
    <View style={styles.container}>
      <PDFText style={textStyles}>
        {format.split(/({page}|{total})/).map((part, i) => {
          if (part === "{page}") {
            return <span key={i} className="pageNumber" />;
          }
          if (part === "{total}") {
            return <span key={i} className="totalPages" />;
          }
          return <span key={i}>{part}</span>;
        })}
      </PDFText>
    </View>
  );
}
