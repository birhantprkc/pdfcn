import type { RenderOptions } from "takumi-pdf";

import { PageFooter } from "@/registry/bases/takumi/components/page-footer/page-footer";
import { PdfPageNumber } from "@/registry/bases/takumi/components/page-number/page-number";
import {
  PdfcnThemeProvider,
  usePdfcnTheme,
} from "@/registry/bases/takumi/components/theme-provider";
import { pointToCssPixel } from "@/registry/bases/takumi/lib/pdf-primitives";

const DEFAULT_MARGIN = 40;

const BLOCK_NAMES = new Set([
  "invoice-classic",
  "invoice-consultant",
  "invoice-corporate",
  "invoice-creative",
  "invoice-minimal",
  "invoice-modern",
  "report-financial",
  "report-marketing",
  "report-operations",
  "report-security",
]);

const COMPONENT_MARGINS: Record<string, number> = {
  divider: 30,
  heading: 30,
  link: 30,
  "page-break": 30,
  "page-footer": 30,
  "page-header": 30,
  section: 30,
  stack: 30,
  text: 30,
};

const REPORT_NAMES = new Set([
  "report-financial",
  "report-marketing",
  "report-operations",
  "report-security",
]);

// A footer repeats on every page as a render option, which is also what lets the
// page counter count.
const ReportFooter = () => {
  const theme = usePdfcnTheme();

  return (
    <PageFooter
      centerText="Generated with pdfcn"
      leftText="Confidential — Internal Use"
      pagePadding={theme.spacing.page.marginLeft}
      rightText={<PdfPageNumber size="xs" />}
      variant="three-column"
    />
  );
};

const reportFooter = (
  <PdfcnThemeProvider>
    <ReportFooter />
  </PdfcnThemeProvider>
);

const COMPONENT_SIZES: Record<
  string,
  Extract<RenderOptions, { viewport?: never }>["size"]
> = {
  badge: { height: pointToCssPixel(200), width: pointToCssPixel(595) },
  "page-footer": {
    height: pointToCssPixel(300),
    width: pointToCssPixel(595),
  },
  "page-header": {
    height: pointToCssPixel(240),
    width: pointToCssPixel(595),
  },
};

export const getTakumiPreviewOptions = (name: string): RenderOptions => {
  const margin = BLOCK_NAMES.has(name)
    ? 0
    : pointToCssPixel(COMPONENT_MARGINS[name] ?? DEFAULT_MARGIN);

  if (REPORT_NAMES.has(name)) {
    return {
      footer: reportFooter,
      // The block paints its own page padding, so only the footer needs room.
      margin: { bottom: "auto", left: 0, right: 0, top: 0 },
      size: "a4",
    };
  }

  return {
    margin,
    size: COMPONENT_SIZES[name] ?? "a4",
  };
};
