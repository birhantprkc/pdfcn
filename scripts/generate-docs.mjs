/**
 * Generates base-scoped docs MDX matching the termcn page outline:
 * Preview → Installation (CLI/Manual) → Usage → API Reference
 *
 * Run: node scripts/generate-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const COMPONENTS = [
  "alert",
  "badge",
  "card",
  "data-table",
  "divider",
  "form",
  "graph",
  "heading",
  "keep-together",
  "key-value",
  "link",
  "list",
  "page-break",
  "page-footer",
  "page-header",
  "page-number",
  "pdf-image",
  "qrcode",
  "section",
  "signature",
  "stack",
  "table",
  "text",
  "watermark",
];

const BLOCKS = [
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
];

const COMPONENT_EXPORTS = {
  alert: "PdfAlert",
  badge: "Badge",
  card: "PdfCard",
  "data-table": "DataTable",
  divider: "Divider",
  form: "PdfForm",
  graph: "PdfGraph",
  heading: "Heading",
  "keep-together": "KeepTogether",
  "key-value": "KeyValue",
  link: "Link",
  list: "PdfList",
  "page-break": "PageBreak",
  "page-footer": "PageFooter",
  "page-header": "PageHeader",
  "page-number": "PdfPageNumber",
  "pdf-image": "PdfImage",
  qrcode: "PdfQRCode",
  section: "Section",
  signature: "PdfSignatureBlock",
  stack: "Stack",
  table: "Table",
  text: "Text",
  watermark: "PdfWatermark",
};

const BLOCK_EXPORTS = {
  "invoice-classic": "InvoiceClassicDocument",
  "invoice-consultant": "InvoiceConsultantDocument",
  "invoice-corporate": "InvoiceCorporateDocument",
  "invoice-creative": "InvoiceCreativeDocument",
  "invoice-minimal": "InvoiceMinimalDocument",
  "invoice-modern": "InvoiceModernDocument",
  "report-financial": "FinancialReportDocument",
  "report-marketing": "MarketingReportDocument",
  "report-operations": "OperationsReportDocument",
  "report-security": "SecurityReportDocument",
};

const DESCRIPTIONS = {
  alert: "Alert box with info, success, warning, and error variants.",
  badge: "Compact status badge for labels and tags.",
  card: "Bordered content card with title and body.",
  "data-table": "Tabular data with columns and rows.",
  divider: "Horizontal rule to separate sections.",
  form: "Labeled form groups for PDF inputs.",
  graph: "Bar, line, and area charts drawn with SVG.",
  heading: "Document headings with typographic scale.",
  "invoice-classic": "Classic invoice document template.",
  "invoice-consultant": "Consultant-style invoice template.",
  "invoice-corporate": "Corporate invoice document template.",
  "invoice-creative": "Creative invoice document template.",
  "invoice-minimal": "Minimal invoice document template.",
  "invoice-modern": "Modern invoice document template.",
  "keep-together": "Keeps children on the same PDF page.",
  "key-value": "Definition list of keys and values.",
  link: "Clickable link styled for PDF documents.",
  list: "Ordered and unordered lists.",
  "page-break": "Forces a page break in the document.",
  "page-footer": "Repeating page footer.",
  "page-header": "Repeating page header.",
  "page-number": "Current page number marker.",
  "pdf-image": "Embedded image with fit options.",
  qrcode: "QR code generated from a string value.",
  "report-financial": "Financial report document template.",
  "report-marketing": "Marketing report document template.",
  "report-operations": "Operations report document template.",
  "report-security": "Security report document template.",
  section: "Section wrapper with optional title.",
  signature: "Signature block with name and label.",
  stack: "Vertical stack with spacing.",
  table: "Low-level table primitives.",
  text: "Body text with typography variants.",
  watermark: "Diagonal or centered watermark overlay.",
};

const USAGE = {
  alert: `<PdfAlert variant="info" title="Info">\n  Alert body\n</PdfAlert>`,
  badge: `<Badge>Badge</Badge>`,
  card: `<PdfCard title="Card">Card body</PdfCard>`,
  "data-table": `<DataTable\n  columns={[{ key: "name", header: "Name" }]}\n  data={[{ name: "Widget" }]}\n/>`,
  divider: `<Divider />`,
  form: `<PdfForm\n  title="Contact"\n  groups={[{ fields: [{ label: "Email" }] }]}\n/>`,
  graph: `<PdfGraph\n  variant="bar"\n  data={[{ label: "Q1", value: 30 }]}\n/>`,
  heading: `<Heading level={1}>Heading</Heading>`,
  "keep-together": `<KeepTogether>\n  <Text>Keep these lines together.</Text>\n</KeepTogether>`,
  "key-value": `<KeyValue items={[{ key: "Name", value: "Ada" }]} />`,
  link: `<Link href="https://example.com">Example</Link>`,
  list: `<PdfList items={[{ text: "Alpha" }, { text: "Beta" }]} />`,
  "page-break": `<PageBreak />`,
  "page-footer": `<PageFooter leftText="pdfcn" rightText="Confidential" />`,
  "page-header": `<PageHeader title="Company" subtitle="Invoice" />`,
  "page-number": `<PdfPageNumber />`,
  "pdf-image": `<PdfImage src="/logo.png" width={120} />`,
  qrcode: `<PdfQRCode value="https://pdfcn.dev" />`,
  section: `<Section>\n  <Text>Section body</Text>\n</Section>`,
  signature: `<PdfSignatureBlock name="Jane Doe" label="Authorized Signature" />`,
  stack: `<Stack gap="md">\n  <Text>One</Text>\n  <Text>Two</Text>\n</Stack>`,
  table: `<Table>\n  <TableHeader>\n    <TableRow>\n      <TableCell><Text>Item</Text></TableCell>\n    </TableRow>\n  </TableHeader>\n</Table>`,
  text: `<Text>Hello from pdfcn</Text>`,
  watermark: `<PdfWatermark text="DRAFT" />`,
};

const BASE_DEPS = {
  forme: "@formepdf/react @formepdf/core",
  takumi: "takumi-pdf @takumi-rs/helpers",
};

const TITLE_OVERRIDES = {
  "data-table": "Data Table",
  "keep-together": "Keep Together",
  "key-value": "Key Value",
  "page-break": "Page Break",
  "page-footer": "Page Footer",
  "page-header": "Page Header",
  "page-number": "Page Number",
  "pdf-image": "PDF Image",
  qrcode: "QR Code",
};

const titleCase = (slug) => {
  if (TITLE_OVERRIDES[slug]) {
    return TITLE_OVERRIDES[slug];
  }
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
};

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const write = (file, content) => {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
};

const escapeMdx = (value) =>
  value.replaceAll("{", "&#123;").replaceAll("}", "&#125;");

const extractPropsTable = (sourcePath, exportName) => {
  if (!fs.existsSync(sourcePath)) {
    return null;
  }
  const src = fs.readFileSync(sourcePath, "utf-8");
  const interfaceMatch = src.match(
    new RegExp(
      `export interface (\\w*Props)\\s+(?:extends [^{]+)?\\{([\\s\\S]*?)\\n\\}`
    )
  );
  if (!interfaceMatch) {
    return null;
  }

  // eslint-disable-next-line prefer-destructuring
  const body = interfaceMatch[2];
  const rows = [];
  const propRegex = /(?:\/\*\*([\s\S]*?)\*\/\s*)?(\w+)(\?)?:\s*([^;]+);/g;
  let match = propRegex.exec(body);
  while (match) {
    const [, jsdoc, name, optional, typeRaw] = match;
    if (name === "style" || name === "wrap") {
      // keep them — common PDF props
    }
    const defaultMatch = jsdoc?.match(/@default\s+([^\n*]+)/);
    const type = typeRaw.replaceAll(/\s+/g, " ").trim();
    rows.push({
      default: escapeMdx(defaultMatch ? defaultMatch[1].trim() : "-"),
      name: `\`${name}\``,
      required: optional ? "No" : "Yes",
      type: `\`${escapeMdx(type)}\``,
    });
    match = propRegex.exec(body);
  }

  if (rows.length === 0) {
    return null;
  }

  const header = `| Prop | Type | Default |\n| ---- | ---- | ------- |`;
  const lines = rows.map(
    (row) => `| ${row.name} | ${row.type} | ${row.default} |`
  );
  return `## API Reference\n\n### ${exportName}\n\n${header}\n${lines.join("\n")}\n`;
};

const manualSources = (base, kind, name) => {
  const sources = [];
  if (kind === "component") {
    sources.push({
      src: `registry/bases/${base}/components/${name}/${name}.tsx`,
      title: `components/pdf/${name}.tsx`,
    });
  } else {
    const file = `${name}.tsx`;
    sources.push({
      src: `registry/bases/${base}/blocks/${name}/${file}`,
      title: `components/pdf/${name}.tsx`,
    });
  }

  sources.push(
    {
      src: `registry/bases/${base}/lib/pdfcn-theme-context.tsx`,
      title: "components/pdf/pdfcn-theme-context.tsx",
    },
    {
      src: `registry/bases/${base}/lib/pdfcn-theme.ts`,
      title: "components/pdf/pdfcn-theme.ts",
    },
    {
      src: `registry/bases/${base}/lib/resolve-color.ts`,
      title: "components/pdf/resolve-color.ts",
    }
  );

  if (base === "takumi") {
    sources.push(
      {
        src: `registry/bases/takumi/lib/takumi-primitives.tsx`,
        title: "components/pdf/takumi-primitives.tsx",
      },
      {
        src: `registry/bases/takumi/lib/takumi-svg.tsx`,
        title: "components/pdf/takumi-svg.tsx",
      }
    );
  }

  return sources
    .filter((s) => fs.existsSync(path.join(ROOT, s.src)))
    .map(
      (s) =>
        `<ComponentSource\n  src="${s.src}"\n  base="${base}"\n  title="${s.title}"\n/>`
    )
    .join("\n\n");
};

const usageSnippet = (kind, name, exportName) => {
  if (kind === "block") {
    return `<${exportName} />`;
  }
  return USAGE[name] ?? `<${exportName} />`;
};

const componentMdx = (base, name) => {
  const exportName = COMPONENT_EXPORTS[name];
  const title = titleCase(name);
  const description =
    DESCRIPTIONS[name] ?? `${title} PDF component for the ${base} base.`;
  const deps = BASE_DEPS[base];
  const sourcePath = path.join(
    ROOT,
    `registry/bases/${base}/components/${name}/${name}.tsx`
  );
  const api = extractPropsTable(sourcePath, exportName) ?? "";
  const importExtra =
    name === "table"
      ? `{ Table, TableBody, TableCell, TableHeader, TableRow, Text }`
      : `{ ${exportName} }`;
  const keepTogetherImport =
    name === "keep-together" ||
    name === "section" ||
    name === "stack" ||
    name === "watermark"
      ? `\nimport { Text } from "@/components/pdf/text";`
      : "";

  return `---
title: "${title}"
description: "${description}"
---

<ComponentPreview base="${base}" name="${name}" hideCode />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

\`\`\`bash
npx shadcn@latest add @pdfcn/${base}/${name}
\`\`\`

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

\`\`\`bash
npm install ${deps}
\`\`\`

<Step>Copy and paste the following code into your project.</Step>

${manualSources(base, "component", name)}

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

\`\`\`tsx
import ${importExtra} from "@/components/pdf/${name}";${keepTogetherImport}
\`\`\`

\`\`\`tsx
${usageSnippet("component", name, exportName)}
\`\`\`

${api}`;
};

const blockMdx = (base, name) => {
  const exportName = BLOCK_EXPORTS[name];
  const title = titleCase(name);
  const description =
    DESCRIPTIONS[name] ?? `${title} PDF block for the ${base} base.`;
  const deps = BASE_DEPS[base];

  return `---
title: "${title}"
description: "${description}"
---

<ComponentPreview base="${base}" name="${name}" hideCode />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

\`\`\`bash
npx shadcn@latest add @pdfcn/${base}/${name}
\`\`\`

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

\`\`\`bash
npm install ${deps}
\`\`\`

<Step>Copy and paste the following code into your project.</Step>

${manualSources(base, "block", name)}

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

\`\`\`tsx
import { ${exportName} } from "@/components/pdf/${name}";
\`\`\`

\`\`\`tsx
<${exportName} />
\`\`\`
`;
};

const baseIndexMdx = (section, base, title) => {
  const folderName = section === "components" ? "Components" : "Blocks";
  const description =
    section === "components"
      ? `PDF UI primitives for the ${title} base.`
      : `Invoice and report templates for the ${title} base.`;

  return `---
title: "${title}"
description: "${description}"
---

<ComponentsList folderName="${folderName}" base="${base}" />
`;
};

const sectionIndexMdx = (section) => {
  if (section === "components") {
    return `---
title: "Components"
description: "PDF UI primitives available on Takumi and Forme bases."
---

Choose a base to browse components.

- [Takumi](/docs/components/takumi)
- [Forme](/docs/components/forme)
`;
  }

  return `---
title: "Blocks"
description: "Full PDF document templates — invoices and reports."
---

Choose a base to browse blocks.

- [Takumi](/docs/blocks/takumi)
- [Forme](/docs/blocks/forme)
`;
};

const writeMeta = (file, title, pages) => {
  write(file, `${JSON.stringify({ pages, title }, null, 2)}\n`);
};

const cleanFlatDocs = (section) => {
  const dir = path.join(ROOT, `content/docs/${section}`);
  for (const entry of fs.readdirSync(dir)) {
    if (entry.endsWith(".mdx") && entry !== "index.mdx") {
      fs.unlinkSync(path.join(dir, entry));
    }
  }
};

const main = () => {
  cleanFlatDocs("components");
  cleanFlatDocs("blocks");

  write(
    path.join(ROOT, "content/docs/components/index.mdx"),
    sectionIndexMdx("components")
  );
  write(
    path.join(ROOT, "content/docs/blocks/index.mdx"),
    sectionIndexMdx("blocks")
  );

  writeMeta(
    path.join(ROOT, "content/docs/components/meta.json"),
    "Components",
    ["index", "takumi", "forme"]
  );
  writeMeta(path.join(ROOT, "content/docs/blocks/meta.json"), "Blocks", [
    "index",
    "takumi",
    "forme",
  ]);

  for (const base of ["takumi", "forme"]) {
    const baseTitle = base === "takumi" ? "Takumi" : "Forme";

    write(
      path.join(ROOT, `content/docs/components/${base}/index.mdx`),
      baseIndexMdx("components", base, baseTitle)
    );
    writeMeta(
      path.join(ROOT, `content/docs/components/${base}/meta.json`),
      baseTitle,
      ["index", ...COMPONENTS]
    );

    for (const name of COMPONENTS) {
      write(
        path.join(ROOT, `content/docs/components/${base}/${name}.mdx`),
        componentMdx(base, name)
      );
    }

    write(
      path.join(ROOT, `content/docs/blocks/${base}/index.mdx`),
      baseIndexMdx("blocks", base, baseTitle)
    );
    writeMeta(
      path.join(ROOT, `content/docs/blocks/${base}/meta.json`),
      baseTitle,
      ["index", ...BLOCKS]
    );

    for (const name of BLOCKS) {
      write(
        path.join(ROOT, `content/docs/blocks/${base}/${name}.mdx`),
        blockMdx(base, name)
      );
    }
  }

  console.log(
    `Generated docs for ${COMPONENTS.length} components × 2 bases and ${BLOCKS.length} blocks × 2 bases`
  );
};

main();
