const PX_PER_MM = 96 / 25.4;
const PAGE_SIZES = {
  a4: { height: 297 * PX_PER_MM, width: 210 * PX_PER_MM },
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

const marginPadding = (margin: PdfOptions["margin"]): string => {
  if (margin === undefined) {
    return `${DEFAULT_PAGE_MARGIN}px`;
  }
  if (typeof margin === "number") {
    return `${margin}px`;
  }
  const { top = 0, right = 0, bottom = 0, left = 0 } = margin;
  return `${top}px ${right}px ${bottom}px ${left}px`;
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
