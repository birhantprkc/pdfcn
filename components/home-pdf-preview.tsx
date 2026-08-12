"use client";

export const homePdfComponentCatalog = {
  alert: {
    codeName: "Alert",
    description:
      "A callout block for warnings, notes, and important information.",
    docsPath: "/alert",
    label: "Alert",
  },
  badge: {
    codeName: "Badge",
    description:
      "A styled label for status indicators, tags, and inline annotations.",
    docsPath: "/badge",
    label: "Badge",
  },
  card: {
    codeName: "Card",
    description:
      "A contained layout for grouping related content with border and padding.",
    docsPath: "/card",
    label: "Card",
  },
  "data-table": {
    codeName: "DataTable",
    description:
      "A full-featured data table with sorting, pagination, and cell formatting.",
    docsPath: "/data-table",
    label: "Data table",
  },
  divider: {
    codeName: "Divider",
    description:
      "A visual separator with configurable color, thickness, and margin.",
    docsPath: "/divider",
    label: "Divider",
  },
  graph: {
    codeName: "Graph",
    description:
      "A data visualization component for charts and statistical graphics.",
    docsPath: "/graph",
    label: "Graph",
  },
  "key-value": {
    codeName: "KeyValue",
    description:
      "A flexible key-value layout for metadata, summaries, and label pairs.",
    docsPath: "/key-value",
    label: "Key-value",
  },
  list: {
    codeName: "List",
    description:
      "An ordered or unordered list with custom markers and nested items.",
    docsPath: "/list",
    label: "List",
  },
  "page-footer": {
    codeName: "PageFooter",
    description:
      "A compact document footer with page numbers, legal text, and brand marks.",
    docsPath: "/page-footer",
    label: "Page footer",
  },
  "page-header": {
    codeName: "PageHeader",
    description:
      "A branded document header with logo, company details, and document title.",
    docsPath: "/page-header",
    label: "Page header",
  },
  "pdf-image": {
    codeName: "PdfImage",
    description:
      "An image component optimized for PDF rendering with aspect ratio and sizing.",
    docsPath: "/pdf-image",
    label: "Image",
  },
  section: {
    codeName: "Section",
    description:
      "A grouped content section with optional title, padding, and background.",
    docsPath: "/section",
    label: "Section",
  },
  signature: {
    codeName: "Signature",
    description:
      "A signature block for authorized signatories and approval lines.",
    docsPath: "/signature",
    label: "Signature",
  },
  table: {
    codeName: "Table",
    description:
      "A structured data table with headers, rows, and responsive column widths.",
    docsPath: "/table",
    label: "Table",
  },
  text: {
    codeName: "Text",
    description:
      "A versatile text component for headings, paragraphs, and inline content.",
    docsPath: "/text",
    label: "Text",
  },
} as const;

export type ComponentPartId = keyof typeof homePdfComponentCatalog;
export type HomePdfBase = "takumi" | "forme";

export const homePdfBases: {
  id: HomePdfBase;
  label: string;
}[] = [
  { id: "takumi", label: "Takumi" },
  { id: "forme", label: "Forme" },
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
    actionHref: "https://pdfcn.dev/docs/components",
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
    actionHref: "https://pdfcn.dev/docs/installation",
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
    actionHref: "https://pdfcn.dev/docs/components",
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
  const functionName = recipe.id
    .split("-")
    .map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`)
    .join("");

  const shell =
    base === "takumi"
      ? {
          import: 'import { Page } from "takumi-pdf";',
        }
      : {
          close: "Document",
          import: 'import { Document, Page } from "@formepdf/react";',
          open: "Document",
        };

  if (base === "takumi") {
    const components = recipe.componentIds
      .map((id) => `      <${homePdfComponentCatalog[id].codeName} />`)
      .join("\n");

    return `${shell.import}
${imports}

export function ${functionName}Document() {
  return (
    <Page>
${components}
    </Page>
  );
}`;
  }

  const components = recipe.componentIds
    .map((id) => `        <${homePdfComponentCatalog[id].codeName} />`)
    .join("\n");

  return `${shell.import}
${imports}

export function ${functionName}Document() {
  return (
    <${shell.open}>
      <Page>
${components}
      </Page>
    </${shell.close}>
  );
}`;
};
