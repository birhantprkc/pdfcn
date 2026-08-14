import type { PageMarginSide } from "takumi-pdf";

const PX_PER_MM = 96 / 25.4;
const PAGE_SIZES = {
  a3: { height: 420 * PX_PER_MM, width: 297 * PX_PER_MM },
  a4: { height: 297 * PX_PER_MM, width: 210 * PX_PER_MM },
  a5: { height: 210 * PX_PER_MM, width: 148 * PX_PER_MM },
  b4: { height: 353 * PX_PER_MM, width: 250 * PX_PER_MM },
  b5: { height: 250 * PX_PER_MM, width: 176 * PX_PER_MM },
  "jis-b4": { height: 364 * PX_PER_MM, width: 257 * PX_PER_MM },
  "jis-b5": { height: 257 * PX_PER_MM, width: 182 * PX_PER_MM },
  ledger: { height: 17 * 96, width: 11 * 96 },
  legal: { height: 14 * 96, width: 8.5 * 96 },
  letter: { height: 11 * 96, width: 8.5 * 96 },
};
const DEFAULT_PAGE_MARGIN = 48;

type PdfOptions = NonNullable<PlaygroundOptions["pdf"]>;

export interface OutputGeometry {
  width: number;
  height?: number;
  padding?: string;
  label: string;
}

// An auto margin is the height of a band the renderer measures, which this HTML
// preview cannot know, so it stands in the default.
const sidePadding = (side: PageMarginSide): number =>
  side === "auto" ? DEFAULT_PAGE_MARGIN : side;

const marginPadding = (margin: PdfOptions["margin"]): string => {
  if (margin === undefined || margin === "auto") {
    return `${DEFAULT_PAGE_MARGIN}px`;
  }
  if (typeof margin === "number") {
    return `${margin}px`;
  }
  const { top = 0, right = 0, bottom = 0, left = 0 } = margin;
  return `${sidePadding(top)}px ${sidePadding(right)}px ${sidePadding(bottom)}px ${sidePadding(left)}px`;
};

const pdfGeometry = (pdf: PdfOptions): OutputGeometry => {
  const size =
    typeof pdf.size === "object" ? pdf.size : PAGE_SIZES[pdf.size ?? "a4"];
  const preset = typeof pdf.size === "object" ? undefined : (pdf.size ?? "a4");
  const width = Math.round(pdf.landscape ? size.height : size.width);
  const height = Math.round(pdf.landscape ? size.width : size.height);
  const name = preset ? preset.toUpperCase() : `${width} × ${height}`;
  return {
    label: pdf.landscape ? `${name} landscape` : name,
    padding: marginPadding(pdf.margin),
    width,
  };
};

export const outputGeometry = (options: PlaygroundOptions): OutputGeometry => {
  if (options.pdf) {
    return pdfGeometry(options.pdf);
  }
  const { width = 1200, height = 630 } = options;
  return { height, label: `${width} × ${height}`, width };
};
