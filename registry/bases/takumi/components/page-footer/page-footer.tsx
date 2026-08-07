import type { PDFComponentProps, PdfcnTheme } from "@/registry/themes";

import { usePdfcnTheme, useSafeMemo } from "../../lib/pdfcn-theme-context";
import { resolveColor } from "../../lib/resolve-color";
import { Text as PDFText, StyleSheet, View } from "../../lib/takumi-primitives";
import type { Style } from "../../lib/takumi-primitives";

export type PageFooterVariant =
  | "simple"
  | "centered"
  | "branded"
  | "minimal"
  | "three-column"
  | "detailed";

/**
 * Footer row with layout variants, optional sticky or fixed positioning, and contact info support.
 * Props - `leftText` | `rightText` | `centerText` | `variant` | `background` | `textColor` | `marginTop` | `address` | `phone` | `email` | `website` | `fixed` | `sticky` | `pagePadding` | `noWrap` | `style`
 * @see {@link PageFooterProps}
 */
export interface PageFooterProps extends Omit<PDFComponentProps, "children"> {
  leftText?: string;
  rightText?: string;
  centerText?: string;
  /**
   * @default 'simple'
   */
  variant?: PageFooterVariant;
  background?: string;
  textColor?: string;
  marginTop?: number;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  /**
   * @default false
   */
  fixed?: boolean;
  /**
   * @default false
   */
  sticky?: boolean;
  /**
   * @default 0
   */
  pagePadding?: number;
  /**
   * @default true
   */
  noWrap?: boolean;
}

function createPageFooterStyles(t: PdfcnTheme) {
  const { spacing, fontWeights } = t.primitives;
  const c = t.colors;
  const { body } = t.typography;

  const textBase = {
    color: c.mutedForeground,
    fontFamily: body.fontFamily,
    fontSize: t.primitives.typography.xs,
    lineHeight: body.lineHeight,
  };

  return StyleSheet.create({
    brandedContainer: {
      alignItems: "center",
      backgroundColor: c.primary,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },

    centeredContainer: {
      alignItems: "center",
      borderTopColor: c.border,
      borderTopStyle: "solid",
      borderTopWidth: spacing[0.5],
      display: "flex",
      flexDirection: "column",
      paddingTop: spacing[3],
    },

    companyBold: {
      ...textBase,
      color: c.foreground,
      fontWeight: fontWeights.bold,
    },

    companyName: {
      ...textBase,
      color: c.foreground,
      fontWeight: fontWeights.medium,
    },

    contactInfoCenter: {
      ...textBase,
      fontSize: t.primitives.typography.xs - 1,
      marginTop: spacing[0.5],
      textAlign: "center",
    },
    detailedContainer: {
      borderTopColor: c.border,
      borderTopStyle: "solid",
      borderTopWidth: spacing[1],
      display: "flex",
      flexDirection: "column",
      paddingTop: spacing[3],
    },
    detailedLeft: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
    },
    detailedPageNumber: {
      ...textBase,
      borderTopColor: c.border,
      borderTopStyle: "solid",
      borderTopWidth: spacing[0.5],
      paddingTop: spacing[2],
      textAlign: "center",
    },
    detailedRight: {
      alignItems: "flex-end",
      display: "flex",
      flexDirection: "column",
    },
    detailedTopRow: {
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing[2],
    },

    minimalContainer: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: spacing[1],
      paddingTop: spacing[1],
    },
    simpleContainer: {
      alignItems: "center",
      borderTopColor: c.border,
      borderTopStyle: "solid",
      borderTopWidth: spacing[0.5],
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: spacing[3],
    },
    textBranded: {
      ...textBase,
      color: c.primaryForeground,
      fontWeight: fontWeights.medium,
    },
    textBrandedRight: {
      ...textBase,
      color: c.primaryForeground,
      textAlign: "right",
    },
    textCenter: {
      ...textBase,
      flex: 1,
      textAlign: "center",
    },
    textCenteredVariant: {
      ...textBase,
      marginBottom: spacing[1],
      textAlign: "center",
    },

    textLeft: {
      ...textBase,
      flex: 1,
    },
    textRight: {
      ...textBase,
      textAlign: "right",
    },
    threeColumnCenter: {
      alignItems: "center",
      display: "flex",
      flex: 1,
      flexDirection: "column",
    },
    threeColumnContainer: {
      alignItems: "flex-start",
      borderTopColor: c.border,
      borderTopStyle: "solid",
      borderTopWidth: spacing[0.5],
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: spacing[3],
    },
    threeColumnLeft: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
    },
    threeColumnRight: {
      alignItems: "flex-end",
      display: "flex",
      flex: 1,
      flexDirection: "column",
    },
  });
}

export function PageFooter({
  leftText,
  rightText,
  centerText,
  variant = "simple",
  background,
  textColor,
  marginTop,
  address,
  phone,
  email,
  website,
  fixed = false,
  sticky = false,
  pagePadding = 0,
  noWrap = true,
  style,
}: PageFooterProps) {
  const theme = usePdfcnTheme();
  const styles = useSafeMemo(() => createPageFooterStyles(theme), [theme]);
  // sticky implies fixed; marginTop is irrelevant with absolute positioning
  const isFixed = fixed || sticky;
  const mt = sticky ? 0 : (marginTop ?? theme.spacing.sectionGap);
  const resolvedTextColor = textColor
    ? resolveColor(textColor, theme.colors)
    : undefined;
  const stickyStyle: Style = sticky
    ? {
        bottom: pagePadding,
        left: pagePadding,
        position: "absolute",
        right: pagePadding,
      }
    : {};

  function applyOverrides(base: Style[]): Style[] {
    if (background) {
      base.push({ backgroundColor: resolveColor(background, theme.colors) });
    }
    if (style) {
      base.push(style);
    }
    if (sticky) {
      base.push(stickyStyle);
    }
    return base;
  }

  if (variant === "branded") {
    const containerStyles = applyOverrides([
      styles.brandedContainer,
      { marginTop: mt },
    ]);

    const lStyle: Style[] = [styles.textBranded];
    const rStyle: Style[] = [styles.textBrandedRight];
    if (resolvedTextColor) {
      lStyle.push({ color: resolvedTextColor });
      rStyle.push({ color: resolvedTextColor });
    }

    return (
      <View wrap={!noWrap} style={containerStyles}>
        {leftText && <PDFText style={lStyle}>{leftText}</PDFText>}
        {rightText && <PDFText style={rStyle}>{rightText}</PDFText>}
      </View>
    );
  }

  if (variant === "centered") {
    const containerStyles = applyOverrides([
      styles.centeredContainer,
      { marginTop: mt },
    ]);

    const tStyle: Style[] = [styles.textCenteredVariant];
    if (resolvedTextColor) {
      tStyle.push({ color: resolvedTextColor });
    }

    return (
      <View wrap={!noWrap} style={containerStyles}>
        {leftText && <PDFText style={tStyle}>{leftText}</PDFText>}
        {rightText && <PDFText style={tStyle}>{rightText}</PDFText>}
      </View>
    );
  }

  if (variant === "three-column") {
    const containerStyles = applyOverrides([
      styles.threeColumnContainer,
      { marginTop: mt },
    ]);

    const leftStyle: Style[] = [styles.companyName];
    const centerStyle: Style[] = [styles.contactInfoCenter];
    const rightStyle: Style[] = [styles.textRight];
    if (resolvedTextColor) {
      leftStyle.push({ color: resolvedTextColor });
      centerStyle.push({ color: resolvedTextColor });
      rightStyle.push({ color: resolvedTextColor });
    }

    return (
      <View wrap={!noWrap} style={containerStyles}>
        <View style={styles.threeColumnLeft}>
          {leftText && <PDFText style={leftStyle}>{leftText}</PDFText>}
          {address && <PDFText style={styles.textLeft}>{address}</PDFText>}
        </View>
        <View style={styles.threeColumnCenter}>
          {phone && <PDFText style={centerStyle}>{phone}</PDFText>}
          {email && <PDFText style={centerStyle}>{email}</PDFText>}
          {website && <PDFText style={centerStyle}>{website}</PDFText>}
        </View>
        <View style={styles.threeColumnRight}>
          {rightText && <PDFText style={rightStyle}>{rightText}</PDFText>}
        </View>
      </View>
    );
  }

  if (variant === "detailed") {
    const containerStyles = applyOverrides([
      styles.detailedContainer,
      { marginTop: mt },
    ]);

    const companyStyle: Style[] = [styles.companyBold];
    const addrStyle: Style[] = [styles.textLeft];
    const contactStyle: Style[] = [styles.textRight];
    const pageNumStyle: Style[] = [styles.detailedPageNumber];
    if (resolvedTextColor) {
      companyStyle.push({ color: resolvedTextColor });
      addrStyle.push({ color: resolvedTextColor });
      contactStyle.push({ color: resolvedTextColor });
      pageNumStyle.push({ color: resolvedTextColor });
    }

    return (
      <View wrap={!noWrap} style={containerStyles}>
        <View style={styles.detailedTopRow}>
          <View style={styles.detailedLeft}>
            {leftText && <PDFText style={companyStyle}>{leftText}</PDFText>}
            {address && <PDFText style={addrStyle}>{address}</PDFText>}
          </View>
          <View style={styles.detailedRight}>
            {phone && (
              <PDFText style={contactStyle}>{`Phone: ${phone}`}</PDFText>
            )}
            {email && (
              <PDFText style={contactStyle}>{`Email: ${email}`}</PDFText>
            )}
            {website && (
              <PDFText style={contactStyle}>{`Web: ${website}`}</PDFText>
            )}
          </View>
        </View>
        {rightText && <PDFText style={pageNumStyle}>{rightText}</PDFText>}
      </View>
    );
  }

  if (variant === "minimal") {
    const containerStyles = applyOverrides([
      styles.minimalContainer,
      { marginTop: mt },
    ]);

    const lStyle: Style[] = [styles.textLeft];
    const rStyle: Style[] = [styles.textRight];
    if (resolvedTextColor) {
      lStyle.push({ color: resolvedTextColor });
      rStyle.push({ color: resolvedTextColor });
    }

    return (
      <View wrap={!noWrap} style={containerStyles}>
        {leftText && <PDFText style={lStyle}>{leftText}</PDFText>}
        {rightText && <PDFText style={rStyle}>{rightText}</PDFText>}
      </View>
    );
  }

  const containerStyles = applyOverrides([
    styles.simpleContainer,
    { marginTop: mt },
  ]);

  const lStyle: Style[] = [styles.textLeft];
  const cStyle: Style[] = [styles.textCenter];
  const rStyle: Style[] = [styles.textRight];
  if (resolvedTextColor) {
    lStyle.push({ color: resolvedTextColor });
    cStyle.push({ color: resolvedTextColor });
    rStyle.push({ color: resolvedTextColor });
  }

  return (
    <View wrap={!noWrap} style={containerStyles}>
      {leftText && <PDFText style={lStyle}>{leftText}</PDFText>}
      {centerText && <PDFText style={cStyle}>{centerText}</PDFText>}
      {rightText && <PDFText style={rStyle}>{rightText}</PDFText>}
    </View>
  );
}
