"use client";

import { BoxIcon } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const homePdfComponentCatalog = {
  alert: {
    codeName: "Alert",
    description:
      "A callout block for warnings, notes, and important information.",
    docsPath: "components/alert",
    label: "Alert",
  },
  badge: {
    codeName: "Badge",
    description:
      "A styled label for status indicators, tags, and inline annotations.",
    docsPath: "components/badge",
    label: "Badge",
  },
  card: {
    codeName: "Card",
    description:
      "A contained layout for grouping related content with border and padding.",
    docsPath: "components/card",
    label: "Card",
  },
  "data-table": {
    codeName: "DataTable",
    description:
      "A full-featured data table with sorting, pagination, and cell formatting.",
    docsPath: "components/data-table",
    label: "Data table",
  },
  divider: {
    codeName: "Divider",
    description:
      "A visual separator with configurable color, thickness, and margin.",
    docsPath: "components/divider",
    label: "Divider",
  },
  graph: {
    codeName: "Graph",
    description:
      "A data visualization component for charts and statistical graphics.",
    docsPath: "components/graph",
    label: "Graph",
  },
  "key-value": {
    codeName: "KeyValue",
    description:
      "A flexible key-value layout for metadata, summaries, and label pairs.",
    docsPath: "components/key-value",
    label: "Key-value",
  },
  list: {
    codeName: "List",
    description:
      "An ordered or unordered list with custom markers and nested items.",
    docsPath: "components/list",
    label: "List",
  },
  "page-footer": {
    codeName: "PageFooter",
    description:
      "A compact document footer with page numbers, legal text, and brand marks.",
    docsPath: "components/page-footer",
    label: "Page footer",
  },
  "page-header": {
    codeName: "PageHeader",
    description:
      "A branded document header with logo, company details, and document title.",
    docsPath: "components/page-header",
    label: "Page header",
  },
  "pdf-image": {
    codeName: "PdfImage",
    description:
      "An image component optimized for PDF rendering with aspect ratio and sizing.",
    docsPath: "components/pdf-image",
    label: "Image",
  },
  section: {
    codeName: "Section",
    description:
      "A grouped content section with optional title, padding, and background.",
    docsPath: "components/section",
    label: "Section",
  },
  signature: {
    codeName: "Signature",
    description:
      "A signature block for authorized signatories and approval lines.",
    docsPath: "components/signature",
    label: "Signature",
  },
  table: {
    codeName: "Table",
    description:
      "A structured data table with headers, rows, and responsive column widths.",
    docsPath: "components/table",
    label: "Table",
  },
  text: {
    codeName: "Text",
    description:
      "A versatile text component for headings, paragraphs, and inline content.",
    docsPath: "components/text",
    label: "Text",
  },
} as const;

export type ComponentPartId = keyof typeof homePdfComponentCatalog;
export type CodeOutput = "react" | "html";
export type HomePdfBase = "takumi" | "forme";

export const homePdfBases: {
  id: HomePdfBase;
  label: string;
}[] = [
  { id: "takumi", label: "Takumi" },
  { id: "forme", label: "Forme" },
];

export const homePdfCodeOutputs: { id: CodeOutput; label: string }[] = [
  { id: "react", label: "React" },
  { id: "html", label: "HTML" },
];

export interface PdfRecipe {
  actionHref: string;
  actionLabel: string;
  componentIds: readonly ComponentPartId[];
  defaultComponentId: ComponentPartId;
  description: string;
  eyebrow: string;
  filename: string;
  heading: string;
  id: PdfRecipeId;
  name: string;
  previewText: string;
}

export type PdfRecipeId =
  | "corporate-invoice"
  | "financial-report"
  | "minimal-invoice";

export const homePdfPreviews = [
  {
    actionHref: "https://pdfcn.run/docs/components",
    actionLabel: "Explore the collection",
    componentIds: [
      "page-header",
      "key-value",
      "table",
      "section",
      "text",
      "page-footer",
    ],
    defaultComponentId: "table",
    description:
      "Production-ready document layouts for invoices, reports, and more — built with composable components.",
    eyebrow: "The document drop · 01",
    filename: "corporate-invoice.tsx",
    heading: "Build PDFs at component speed.",
    id: "corporate-invoice",
    name: "Corporate invoice",
    previewText: "A new component collection from pdfcn",
  },
  {
    actionHref: "https://pdfcn.run/docs/installation",
    actionLabel: "Build your first PDF",
    componentIds: ["page-header", "text", "graph", "data-table", "page-footer"],
    defaultComponentId: "graph",
    description:
      "Start with a component, make it yours, and render confidently. Everything you need is ready.",
    eyebrow: "Financial overview",
    filename: "financial-report.tsx",
    heading: "Your PDF workspace is ready.",
    id: "financial-report",
    name: "Financial report",
    previewText: "Start building your first PDF",
  },
  {
    actionHref: "https://pdfcn.run/docs/components",
    actionLabel: "Browse components",
    componentIds: [
      "page-header",
      "text",
      "divider",
      "key-value",
      "page-footer",
    ],
    defaultComponentId: "text",
    description:
      "A clean, minimal invoice layout with essential billing details and payment terms.",
    eyebrow: "Invoice #INV-2026-042",
    filename: "minimal-invoice.tsx",
    heading: "Simple, clean, professional.",
    id: "minimal-invoice",
    name: "Minimal invoice",
    previewText: "Minimal invoice from pdfcn",
  },
] as const satisfies readonly PdfRecipe[];

export const getHomePdfSource = (recipe: PdfRecipe, base: HomePdfBase) => {
  const imports = recipe.componentIds
    .map((id) => {
      const component = homePdfComponentCatalog[id];
      return `import { ${component.codeName} } from "@/registry/bases/${base}/components/${id}";`;
    })
    .join("\n");
  const components = recipe.componentIds
    .map((id) => `      <${homePdfComponentCatalog[id].codeName} />`)
    .join("\n");
  const functionName = recipe.id
    .split("-")
    .map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`)
    .join("");

  const shell =
    base === "takumi"
      ? {
          close: "Page",
          import: 'import { Page } from "takumi-pdf";',
          open: "Page",
        }
      : {
          close: "Document",
          import: 'import { Document, Page } from "@formepdf/react";',
          open: "Document",
        };

  return `${shell.import}
${imports}

export function ${functionName}Document() {
  return (
    <${shell.open}>
      <${shell.open === "Document" ? "Page" : "Page"}>
${components}
      </${shell.open === "Document" ? "Page" : "Page"}>
    </${shell.close}>
  );
}`;
};

const SelectablePdfPart = ({
  children,
  id,
  selectedId,
  onSelect,
  className,
}: {
  children: React.ReactNode;
  id: ComponentPartId;
  selectedId: ComponentPartId;
  onSelect: (id: ComponentPartId) => void;
  className?: string;
}) => {
  const isSelected = selectedId === id;

  return (
    <button
      type="button"
      aria-label={`Inspect ${homePdfComponentCatalog[id].label}`}
      aria-pressed={isSelected}
      className={cn(
        "group/pdf-part relative block w-full cursor-pointer text-left outline-none transition-[box-shadow] duration-200",
        "hover:z-10 hover:shadow-[inset_0_0_0_2px_rgb(96_165_250)]",
        "focus-visible:z-10 focus-visible:shadow-[inset_0_0_0_3px_rgb(59_130_246)]",
        isSelected && "z-10 shadow-[inset_0_0_0_2px_rgb(59_130_246)]",
        className
      )}
      onClick={() => onSelect(id)}
    >
      {children}
      <Badge
        className={cn(
          "pointer-events-none absolute top-0 right-3 z-20 -translate-y-1/2 bg-blue-600 py-1 text-[9px] leading-none font-semibold tracking-wide text-white uppercase shadow-sm transition-opacity",
          isSelected
            ? "opacity-100"
            : "opacity-0 group-hover/pdf-part:opacity-100 group-focus-visible/pdf-part:opacity-100"
        )}
      >
        <BoxIcon className="size-2.5" aria-hidden="true" />
        {id}
      </Badge>
    </button>
  );
};

const CorporateInvoicePreview = ({
  selectedId,
  onSelect,
}: PdfPreviewContentProps) => (
  <div className="w-full bg-white font-sans text-foreground">
    <SelectablePdfPart
      id="page-header"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-background px-6 py-5 sm:px-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LogoMark className="size-4" />
          </span>
          PDFx Inc.
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
            Invoice
          </p>
          <p className="mt-0.5 text-[10px] font-medium">INV-2026-004</p>
        </div>
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="key-value"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-background px-6 py-5 sm:px-8"
    >
      <div className="grid grid-cols-2 gap-4 text-[10px]">
        <div>
          <p className="font-semibold text-muted-foreground uppercase">
            Bill To
          </p>
          <p className="mt-1 font-medium">Global Industries Ltd.</p>
          <p className="text-muted-foreground">accounts@globalindustries.com</p>
          <p className="text-muted-foreground">+1 (555) 888-9999</p>
        </div>
        <div>
          <p className="font-semibold text-muted-foreground uppercase">
            Details
          </p>
          <p className="mt-1 text-muted-foreground">Date: Feb 22, 2026</p>
          <p className="text-muted-foreground">Due: Mar 24, 2026</p>
          <p className="text-muted-foreground">Net 30 terms</p>
        </div>
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="table"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-background px-6 py-4 sm:px-8"
    >
      <div className="rounded-lg border">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left font-semibold">Description</th>
              <th className="px-3 py-2 text-center font-semibold">Qty</th>
              <th className="px-3 py-2 text-right font-semibold">Price</th>
              <th className="px-3 py-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              ["Enterprise Software License", "5", "$4,500", "$22,500"],
              ["Implementation Services", "1", "$18,000", "$18,000"],
              ["Training Workshop", "3", "$2,500", "$7,500"],
              ["Annual Support Package", "1", "$8,500", "$8,500"],
            ].map(([desc, qty, price, total]) => (
              <tr key={desc} className="divide-x">
                <td className="px-3 py-2 font-medium">{desc}</td>
                <td className="px-3 py-2 text-center">{qty}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">
                  {price}
                </td>
                <td className="px-3 py-2 text-right font-medium">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="section"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-muted/30 px-6 py-4 sm:px-8"
    >
      <div className="ml-auto w-48 text-[10px]">
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Subtotal</span>
          <span>$56,500</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>$4,520</span>
        </div>
        <div className="flex justify-between border-t py-1.5 font-semibold">
          <span>Total</span>
          <span>$61,020</span>
        </div>
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="text"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-background px-6 py-4 sm:px-8"
    >
      <p className="text-[9px] text-muted-foreground">
        Corporate billing — Net 30 terms apply. For inquiries, contact
        accounts@pdfx.io
      </p>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="page-footer"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-primary px-6 py-4 text-primary-foreground/60 sm:px-8"
    >
      <div className="flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-1.5">
          <LogoMark className="size-3" />
          pdfcn
        </div>
        <span>Page 1 of 1</span>
      </div>
    </SelectablePdfPart>
  </div>
);

const FinancialReportPreview = ({
  selectedId,
  onSelect,
}: PdfPreviewContentProps) => (
  <div className="w-full bg-white font-sans text-foreground">
    <SelectablePdfPart
      id="page-header"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-background px-6 py-5 sm:px-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <LogoMark className="size-4" />
          </span>
          PDFx Inc.
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-semibold text-emerald-700">
          Q4 2025
        </span>
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="text"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-background px-6 py-6 text-center sm:px-8"
    >
      <p className="text-[9px] font-bold tracking-[0.22em] text-emerald-600 uppercase">
        Financial Overview
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">
        Quarterly Revenue Report
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-[11px] text-muted-foreground">
        Summary of financial performance for Q4 2025 across all business units.
      </p>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="graph"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-muted/30 px-6 py-5 sm:px-8"
    >
      <div className="flex items-end justify-center gap-2 h-24">
        {[65, 45, 80, 55, 70, 90].map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-8 rounded-t bg-emerald-500/80"
              style={{ height: `${h}%` }}
            />
            <span className="text-[8px] text-muted-foreground">
              {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
            </span>
          </div>
        ))}
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="data-table"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-background px-6 py-4 sm:px-8"
    >
      <div className="rounded-lg border">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left font-semibold">Segment</th>
              <th className="px-3 py-2 text-right font-semibold">Revenue</th>
              <th className="px-3 py-2 text-right font-semibold">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              ["Enterprise", "$2.4M", "+18%"],
              ["SMB", "$1.1M", "+24%"],
              ["Consumer", "$890K", "+12%"],
            ].map(([segment, revenue, growth]) => (
              <tr key={segment} className="divide-x">
                <td className="px-3 py-2 font-medium">{segment}</td>
                <td className="px-3 py-2 text-right">{revenue}</td>
                <td className="px-3 py-2 text-right font-medium text-emerald-600">
                  {growth}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="page-footer"
      selectedId={selectedId}
      onSelect={onSelect}
      className="bg-emerald-600 px-6 py-4 text-emerald-100/60 sm:px-8"
    >
      <div className="flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-1.5">
          <LogoMark className="size-3" />
          pdfcn
        </div>
        <span>Page 1 of 1</span>
      </div>
    </SelectablePdfPart>
  </div>
);

const MinimalInvoicePreview = ({
  selectedId,
  onSelect,
}: PdfPreviewContentProps) => (
  <div className="w-full bg-white font-sans text-foreground">
    <SelectablePdfPart
      id="page-header"
      selectedId={selectedId}
      onSelect={onSelect}
      className="px-6 py-6 sm:px-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
            <LogoMark className="size-4" />
          </span>
          pdfcn
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
            Invoice
          </p>
          <p className="mt-0.5 text-[10px] font-medium">INV-2026-042</p>
        </div>
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="text"
      selectedId={selectedId}
      onSelect={onSelect}
      className="px-6 py-4 sm:px-10"
    >
      <p className="text-lg font-semibold">Invoice for Design Services</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Professional design consultation and brand identity package.
      </p>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="divider"
      selectedId={selectedId}
      onSelect={onSelect}
      className="px-6 sm:px-10"
    >
      <div className="h-px bg-border" />
    </SelectablePdfPart>

    <SelectablePdfPart
      id="key-value"
      selectedId={selectedId}
      onSelect={onSelect}
      className="px-6 py-4 sm:px-10"
    >
      <div className="grid grid-cols-2 gap-6 text-[10px]">
        <div>
          <p className="font-semibold text-muted-foreground uppercase">From</p>
          <p className="mt-1 font-medium">PDFx Inc.</p>
          <p className="text-muted-foreground">hello@pdfx.io</p>
        </div>
        <div>
          <p className="font-semibold text-muted-foreground uppercase">To</p>
          <p className="mt-1 font-medium">Acme Corp</p>
          <p className="text-muted-foreground">billing@acme.com</p>
        </div>
      </div>
    </SelectablePdfPart>

    <SelectablePdfPart
      id="page-footer"
      selectedId={selectedId}
      onSelect={onSelect}
      className="px-6 py-4 sm:px-10"
    >
      <div className="flex items-center justify-between text-[9px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <LogoMark className="size-3" />
          pdfcn
        </div>
        <span>Page 1 of 1</span>
      </div>
    </SelectablePdfPart>
  </div>
);

interface PdfPreviewContentProps {
  selectedId: ComponentPartId;
  onSelect: (id: ComponentPartId) => void;
}

export const HomePdfPreview = ({
  pdfId,
  selectedId,
  onSelect,
}: PdfPreviewContentProps & { pdfId: PdfRecipeId }) => {
  if (pdfId === "financial-report") {
    return (
      <FinancialReportPreview selectedId={selectedId} onSelect={onSelect} />
    );
  }
  if (pdfId === "minimal-invoice") {
    return (
      <MinimalInvoicePreview selectedId={selectedId} onSelect={onSelect} />
    );
  }
  return (
    <CorporateInvoicePreview selectedId={selectedId} onSelect={onSelect} />
  );
};
