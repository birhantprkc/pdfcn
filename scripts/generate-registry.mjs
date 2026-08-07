/**
 * Generates examples + registry.json for all pdfcn components/blocks on both bases.
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

function titleCase(slug) {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function demoForComponent(base, name) {
  const exportName =
    COMPONENT_EXPORTS[name] ?? titleCase(name).replaceAll(' ', "");
  const isForme = base === "forme";

  const wrappers = isForme
    ? `import { Document, Page } from "@formepdf/react";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";
import { ${exportName} } from "@/registry/bases/forme/components/${name}";

export default function Demo() {
  return (
    <Document>
      <Page size="A4" margin={48}>
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}
`
    : `import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { ${exportName} } from "@/registry/bases/takumi/components/${name}";

export default function Demo() {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}
`;

  const bodies = {
    alert: `function DemoBody() {
  return <PdfAlert variant="info" title="Info">Alert body</PdfAlert>;
}`,
    badge: `function DemoBody() {
  return <Badge>Badge</Badge>;
}`,
    card: `function DemoBody() {
  return <PdfCard title="Card">Card body</PdfCard>;
}`,
    "data-table": `function DemoBody() {
  return (
    <DataTable
      columns={[
        { key: "name", header: "Name" },
        { key: "price", header: "Price" },
      ]}
      data={[
        { name: "Widget", price: "$10" },
        { name: "Gadget", price: "$20" },
      ]}
    />
  );
}`,
    divider: `function DemoBody() {
  return <Divider />;
}`,
    form: `function DemoBody() {
  return (
    <PdfForm
      title="Contact"
      groups={[{ fields: [{ label: "Email" }, { label: "Phone" }] }]}
    />
  );
}`,
    graph: `function DemoBody() {
  return (
    <PdfGraph
      variant="bar"
      data={[
        { label: "Q1", value: 30 },
        { label: "Q2", value: 45 },
        { label: "Q3", value: 28 },
      ]}
    />
  );
}`,
    heading: `function DemoBody() {
  return <Heading level={1}>Heading</Heading>;
}`,
    "keep-together": `function DemoBody() {
  return (
    <KeepTogether>
      <Text>Keep these lines together on one page.</Text>
    </KeepTogether>
  );
}`,
    "key-value": `function DemoBody() {
  return <KeyValue items={[{ key: "Name", value: "Ada" }]} />;
}`,
    link: `function DemoBody() {
  return <Link href="https://example.com">Example</Link>;
}`,
    list: `function DemoBody() {
  return <PdfList items={[{ text: "Alpha" }, { text: "Beta" }, { text: "Gamma" }]} />;
}`,
    "page-break": `function DemoBody() {
  return (
    <>
      <Text>Before</Text>
      <PageBreak />
      <Text>After</Text>
    </>
  );
}`,
    "page-footer": `function DemoBody() {
  return <PageFooter leftText="pdfcn" rightText="Confidential" />;
}`,
    "page-header": `function DemoBody() {
  return <PageHeader title="Company" subtitle="Invoice" />;
}`,
    "page-number": `function DemoBody() {
  return <PdfPageNumber />;
}`,
    "pdf-image": `function DemoBody() {
  return <Text>PdfImage demo — pass src in your document.</Text>;
}`,
    qrcode: `function DemoBody() {
  return <PdfQRCode value="https://pdfcn.dev" />;
}`,
    section: `function DemoBody() {
  return <Section><Text>Section body</Text></Section>;
}`,
    signature: `function DemoBody() {
  return <PdfSignatureBlock name="Jane Doe" label="Authorized Signature" />;
}`,
    stack: `function DemoBody() {
  return (
    <Stack gap="md">
      <Text>One</Text>
      <Text>Two</Text>
    </Stack>
  );
}`,
    table: `function DemoBody() {
  return <Text>See table demo composition in docs.</Text>;
}`,
    text: `function DemoBody() {
  return <Text>Hello from pdfcn ${base}</Text>;
}`,
    watermark: `function DemoBody() {
  return (
    <>
      <PdfWatermark text="DRAFT" />
      <Text>Document content</Text>
    </>
  );
}`,
  };

  const body =
    bodies[name] ?? `function DemoBody() {\n  return <${exportName} />;\n}`;

  // table demo has its own imports - prepend carefully
  if (name === "table") {
    return `${
      isForme
        ? `import { Document, Page } from "@formepdf/react";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";
import { Table } from "@/registry/bases/forme/components/table";
`
        : `import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Table } from "@/registry/bases/takumi/components/table";
`
    }import { TableBody, TableCell, TableHeader, TableRow, Text } from "@/registry/bases/${base}/components";

export default function Demo() {
  return (
    <Document>
      <Page size="A4"${isForme ? " margin={48}" : ""}>
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}

function DemoBody() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell><Text>Item</Text></TableCell>
          <TableCell><Text>Qty</Text></TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell><Text>Widget</Text></TableCell>
          <TableCell><Text>2</Text></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
`;
  }

  // For stack/section demos need Text import
  const needsText = [
    "stack",
    "page-break",
    "keep-together",
    "watermark",
  ].includes(name);
  const textImport = needsText
    ? `import { Text } from "@/registry/bases/${base}/components/text";\n`
    : "";

  return `${wrappers.replace(
    `import { ${exportName} } from "@/registry/bases/${base}/components/${name}";`,
    `import { ${exportName} } from "@/registry/bases/${base}/components/${name}";\n${textImport}`
  )}\n${body}\n`;
}

function demoForBlock(base, name) {
  const exportMap = {
    "invoice-classic": "InvoiceClassicDocument",
    "invoice-consultant": "InvoiceConsultantDocument",
    "invoice-corporate": "InvoiceCorporateDocument",
    "invoice-creative": "InvoiceCreativeDocument",
    "invoice-minimal": "InvoiceMinimalDocument",
    "invoice-modern": "InvoiceModernDocument",
    "report-financial": "ReportFinancialDocument",
    "report-marketing": "ReportMarketingDocument",
    "report-operations": "ReportOperationsDocument",
    "report-security": "ReportSecurityDocument",
  };
  const exp = exportMap[name];
  // Check actual export from file
  const file = path.join(
    ROOT,
    `registry/bases/${base}/blocks/${name}/${name}.tsx`
  );
  const src = fs.readFileSync(file, "utf-8");
  const match = src.match(/export function (\w+)/);
  const fn = match?.[1] ?? exp;

  return `import { ${fn} } from "@/registry/bases/${base}/blocks/${name}/${name}";

export default function Demo() {
  return <${fn} />;
}
`;
}

function collectFiles(base, kind, name) {
  const dir = path.join(
    ROOT,
    `registry/bases/${base}/${kind === "block" ? "blocks" : "components"}/${name}`
  );
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
    .filter((f) => !f.endsWith(".test.tsx") && f !== "index.ts")
    .map((f) => ({
      path: `registry/bases/${base}/${kind === "block" ? "blocks" : "components"}/${name}/${f}`,
      type: kind === "block" ? "registry:block" : "registry:component",
    }));
}

function libFiles(base) {
  const files = [
    "pdfcn-theme.ts",
    "pdfcn-theme-context.tsx",
    "resolve-color.ts",
  ];
  if (base === "takumi") {
    files.push("takumi-primitives.tsx", "takumi-svg.tsx");
  } else {
    files.push("forme-svg.tsx", "maybe-fixed.tsx");
  }
  return files
    .filter((f) =>
      fs.existsSync(path.join(ROOT, `registry/bases/${base}/lib/${f}`))
    )
    .map((f) => ({
      path: `registry/bases/${base}/lib/${f}`,
      type: "registry:lib",
    }));
}

function main() {
  const items = [];
  const demoImports = { forme: [], takumi: [] };

  for (const base of ["takumi", "forme"]) {
    const deps =
      base === "takumi"
        ? ["takumi-pdf", "@takumi-rs/helpers"]
        : ["@formepdf/react", "@formepdf/core"];

    // lib item
    items.push({
      dependencies: deps,
      description: `Theme context and helpers for the ${base} base`,
      files: libFiles(base),
      name: `${base}/utils`,
      title: `${titleCase(base)} Utils`,
      type: "registry:lib",
    });

    for (const name of COMPONENTS) {
      const files = collectFiles(base, "component", name);
      // always include index if present
      const indexPath = `registry/bases/${base}/components/${name}/index.ts`;
      if (fs.existsSync(path.join(ROOT, indexPath))) {
        files.push({ path: indexPath, type: "registry:component" });
      }

      const registryDeps = [`${base}/utils`];
      if (name === "data-table") {
        registryDeps.push(`${base}/table`);
      }

      items.push({
        dependencies: [...deps, ...(name === "qrcode" ? ["qrcode"] : [])],
        description: `${titleCase(name)} PDF component (${base})`,
        files,
        name: `${base}/${name}`,
        registryDependencies: registryDeps,
        title: titleCase(name),
        type: "registry:ui",
      });

      const demoPath = path.join(ROOT, `examples/${base}/${name}.tsx`);
      fs.mkdirSync(path.dirname(demoPath), { recursive: true });
      fs.writeFileSync(demoPath, demoForComponent(base, name));
      demoImports[base].push(name);
    }

    for (const name of BLOCKS) {
      const files = collectFiles(base, "block", name);
      items.push({
        dependencies: deps,
        description: `${titleCase(name)} PDF block (${base})`,
        files,
        name: `${base}/${name}`,
        registryDependencies: [`${base}/utils`],
        title: titleCase(name),
        type: "registry:block",
      });

      const demoPath = path.join(ROOT, `examples/${base}/${name}.tsx`);
      fs.writeFileSync(demoPath, demoForBlock(base, name));
      demoImports[base].push(name);
    }

    // themes
    for (const theme of [
      "professional",
      "modern",
      "minimal",
      "executive",
      "corporate",
      "elegant",
      "vivid",
      "forest",
      "blueprint",
    ]) {
      items.push({
        dependencies: deps,
        description: `${theme} theme tokens for ${base}`,
        files: [
          {
            path: `registry/themes/${theme}.ts`,
            target: `components/pdf/theme-${theme}.ts`,
            type: "registry:theme",
          },
          {
            path: `registry/themes/primitives.ts`,
            target: `components/pdf/primitives.ts`,
            type: "registry:theme",
          },
          {
            path: `registry/themes/theme-types.ts`,
            target: `components/pdf/theme-types.ts`,
            type: "registry:theme",
          },
          {
            path: `registry/bases/${base}/lib/pdfcn-theme.ts`,
            target: `components/pdf/pdfcn-theme.ts`,
            type: "registry:lib",
          },
        ],
        name: `${base}/theme-${theme}`,
        title: `${titleCase(theme)} Theme (${base})`,
        type: "registry:theme",
      });
    }
  }

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    homepage: "https://pdfcn.vercel.app",
    items,
    name: "pdfcn",
  };

  for (const item of items) {
    for (const file of item.files ?? []) {
      if (!file.target) {
        file.target = file.path
          .replace(/^registry\/bases\/(takumi|forme)\//, "components/pdf/")
          .replace(/^registry\/themes\//, "components/pdf/theme/");
      }
    }
  }

  fs.writeFileSync(
    path.join(ROOT, "registry.json"),
    `${JSON.stringify(registry, null, 2)}\n`
  );

  // examples index
  let indexSrc = `import type { ComponentType } from "react";\nimport type { BaseName } from "@/registry/bases";\n\n`;
  for (const base of ["takumi", "forme"]) {
    for (const name of demoImports[base]) {
      const ident = `${base}_${name.replaceAll('-', "_")}`;
      indexSrc += `import ${ident} from "@/examples/${base}/${name}";\n`;
    }
  }
  indexSrc += `\ntype DemoMap = Record<string, ComponentType>;\n\nexport const demos: Record<BaseName, DemoMap> = {\n`;
  for (const base of ["takumi", "forme"]) {
    indexSrc += `  ${base}: {\n`;
    for (const name of demoImports[base]) {
      const ident = `${base}_${name.replaceAll('-', "_")}`;
      indexSrc += `    "${name}": ${ident},\n`;
    }
    indexSrc += `  },\n`;
  }
  indexSrc += `};\n\nexport type DemoName = string;\n`;
  fs.writeFileSync(path.join(ROOT, "examples/__index__.ts"), indexSrc);

  console.log("items:", items.length);
  console.log("demos takumi:", demoImports.takumi.length);
  console.log("demos forme:", demoImports.forme.length);
}

main();
