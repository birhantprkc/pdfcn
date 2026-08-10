/**
 * Generates examples + registry.json for all pdfcn components/blocks on both bases.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PREVIEW_IMAGE_DATA_URI = `data:image/png;base64,${fs
  .readFileSync(path.join(ROOT, "public/favicon.png"))
  .toString("base64")}`;
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

const titleCase = (slug) =>
  slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

const demoForComponent = (base, name) => {
  const exportName =
    COMPONENT_EXPORTS[name] ?? titleCase(name).replaceAll(" ", "");
  const isForme = base === "forme";

  const wrappers = isForme
    ? `import { Document, Page } from "@formepdf/react";
import { ${exportName} } from "@/registry/bases/forme/components/${name}";

__DEMO_BODY__

const Demo = () => {
  return (
    <Document>
      <Page size="A4" margin={48}>
        <DemoBody />
      </Page>
    </Document>
  );
};
export default Demo;
`
    : `import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { ${exportName} } from "@/registry/bases/takumi/components/${name}";

__DEMO_BODY__

const Demo = () => {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};
export default Demo;
`;

  const bodies = {
    alert: `function DemoBody() {
  return (
    <Section spacing="none">
      <Heading level={1}>Document Alerts</Heading>
      <Text>
        The PdfAlert component displays callout boxes with different severity levels.
      </Text>

      <Section>
        <PdfAlert variant="info" title="Information">
          This document contains important information about your account.
        </PdfAlert>
        <PdfAlert variant="success" title="Success">
          Your payment has been processed successfully.
        </PdfAlert>
        <PdfAlert variant="warning" title="Warning">
          Please review the terms and conditions before proceeding.
        </PdfAlert>
        <PdfAlert variant="error" title="Error">
          Missing required fields. Please complete all sections.
        </PdfAlert>
      </Section>
    </Section>
  );
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
  return <PdfImage src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nYQAAAAASUVORK5CYII=" caption="PDF image preview" />;
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

  const rawBody =
    bodies[name] ?? `function DemoBody() {\n  return <${exportName} />;\n}`;
  const body = rawBody
    .replace("function DemoBody() {", "const DemoBody = () => {")
    .replace(/\n}$/, "\n};");

  // table demo has its own imports - prepend carefully
  if (name === "table") {
    const providerOpen = isForme ? "" : "        <PdfcnThemeProvider>\n";
    const providerClose = isForme ? "" : "        </PdfcnThemeProvider>\n";
    return `${
      isForme
        ? `import { Document, Page } from "@formepdf/react";
import { Table } from "@/registry/bases/forme/components/table";
`
        : `import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Table } from "@/registry/bases/takumi/components/table";
`
    }import { TableBody, TableCell, TableHeader, TableRow, Text } from "@/registry/bases/${base}/components";

const DemoBody = () => {
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
};

const Demo = () => {
  return (
    <Document>
      <Page size="A4"${isForme ? " margin={48}" : ""}>
${providerOpen}        <DemoBody />
${providerClose}      </Page>
    </Document>
  );
};
export default Demo;
`;
  }

  // Some demos compose the component with other registry primitives.
  const needsText = [
    "stack",
    "section",
    "page-break",
    "keep-together",
    "watermark",
  ].includes(name);
  let supportingImports = "";
  if (name === "alert") {
    supportingImports = `import { Heading } from "@/registry/bases/${base}/components/heading";\nimport { Section } from "@/registry/bases/${base}/components/section";\nimport { Text } from "@/registry/bases/${base}/components/text";\n`;
  } else if (needsText) {
    supportingImports = `import { Text } from "@/registry/bases/${base}/components/text";\n`;
  }

  return wrappers
    .replace(
      `import { ${exportName} } from "@/registry/bases/${base}/components/${name}";`,
      `import { ${exportName} } from "@/registry/bases/${base}/components/${name}";\n${supportingImports}`
    )
    .replace("__DEMO_BODY__", body);
};

const REFERENCE_COMPONENT_DEMOS = {
  alert: {
    imports: ["Heading", "PdfAlert", "Section", "Text"],
    jsx: `<Section spacing="none">
      <Heading level={1}>Document Alerts</Heading>
      <Text>
        The PdfAlert component displays callout boxes with different severity levels.
      </Text>
      <Section>
        <PdfAlert variant="info" title="Information">
          This document contains important information about your account.
        </PdfAlert>
        <PdfAlert variant="success" title="Success">
          Your payment has been processed successfully.
        </PdfAlert>
        <PdfAlert variant="warning" title="Warning">
          Please review the terms and conditions before proceeding.
        </PdfAlert>
        <PdfAlert variant="error" title="Error">
          Missing required fields. Please complete all sections.
        </PdfAlert>
      </Section>
    </Section>`,
    margin: 40,
  },
  badge: {
    imports: ["Badge"],
    jsx: `<View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 12,
      }}
    >
      <Badge label="Small" variant="default" size="sm" />
      <Badge label="Medium" variant="default" size="md" />
      <Badge label="Large" variant="default" size="lg" />
    </View>`,
    margin: 40,
    size: { height: 200, width: 595 },
  },
  card: {
    imports: ["PdfCard", "Text"],
    jsx: `<PdfCard title="Project Summary" variant="default" padding="md">
      <Text noMargin>
        This card groups related content with a title and body area. Use cards to
        visually separate sections of your PDF document.
      </Text>
    </PdfCard>`,
    margin: 40,
  },
  "data-table": {
    imports: ["DataTable", "Heading", "Section"],
    jsx: `<Section spacing="none">
      <Heading level={3}>Team Directory</Heading>
      <DataTable
        size="compact"
        variant="striped"
        columns={[
          { key: "id", header: "ID", align: "center" },
          { key: "name", header: "Name" },
          { key: "dept", header: "Department" },
          { key: "status", header: "Status", align: "center" },
        ]}
        data={[
          { id: 1, name: "Alice Johnson", dept: "Engineering", status: "Active" },
          { id: 2, name: "Bob Smith", dept: "Marketing", status: "Active" },
          { id: 3, name: "Carol Lee", dept: "Design", status: "Inactive" },
          { id: 4, name: "Dan Wilson", dept: "Engineering", status: "Active" },
          { id: 5, name: "Eve Brown", dept: "Sales", status: "Active" },
          { id: 6, name: "Frank Chen", dept: "Support", status: "Active" },
          { id: 7, name: "Grace Kim", dept: "Product", status: "Active" },
          { id: 8, name: "Hank Davis", dept: "Marketing", status: "Inactive" },
        ]}
      />
    </Section>`,
    margin: 40,
  },
  divider: {
    imports: ["Divider", "Heading", "Text"],
    jsx: `<View>
      <Heading level={2}>Section 1</Heading>
      <Text>Content here.</Text>
      <Divider />
      <Heading level={2}>Section 2</Heading>
      <Text>More content.</Text>
      <Divider variant="dashed" />
      <Heading level={2}>Section 3</Heading>
      <Text>More content.</Text>
      <Divider variant="dotted" />
      <Heading level={2}>Section 4</Heading>
      <Text>More content.</Text>
      <Divider label="Section Divider" />
      <Heading level={2}>Section 5</Heading>
      <Text>More content.</Text>
    </View>`,
    margin: 30,
  },
  form: {
    imports: ["PdfForm"],
    jsx: `<PdfForm
      title="Job Application"
      subtitle="Please complete all fields clearly in block capitals."
      variant="underline"
      groups={[
        {
          title: "Personal Information",
          fields: [
            { label: "Full Name", hint: "First and last name" },
            { label: "Date of Birth", hint: "DD / MM / YYYY" },
            { label: "Email Address" },
            { label: "Phone Number", hint: "+1 (555) 000-0000" },
          ],
        },
        {
          title: "Address",
          layout: "two-column",
          fields: [
            { label: "Street Address", width: "100%" },
            { label: "City" },
            { label: "State / Province" },
            { label: "Postal Code" },
          ],
        },
        {
          title: "Additional Information",
          fields: [{ label: "Cover Letter", height: 60 }],
        },
      ]}
    />`,
    margin: 40,
  },
  graph: {
    imports: ["PdfGraph"],
    jsx: `<PdfGraph
      variant="bar"
      title="Monthly Revenue"
      subtitle="FY 2025"
      data={[
        { label: "Jan", value: 42_000 },
        { label: "Feb", value: 38_000 },
        { label: "Mar", value: 55_000 },
        { label: "Apr", value: 61_000 },
        { label: "May", value: 49_000 },
        { label: "Jun", value: 72_000 },
      ]}
      showValues
      width={480}
      height={260}
    />`,
    margin: 40,
  },
  heading: {
    imports: ["Heading", "Section"],
    jsx: `<Section spacing="none">
      <Heading level={1}>Main Title</Heading>
      <Heading level={2} align="center" color="primary">
        Subtitle
      </Heading>
      <Heading level={3} style={{ color: "#1e3a5f" }}>
        Custom Styled
      </Heading>
    </Section>`,
    margin: 30,
  },
  "keep-together": {
    imports: ["Heading", "KeepTogether", "Section", "Text"],
    jsx: `<Section spacing="none">
      <KeepTogether>
        <Heading level={2}>Section Title</Heading>
        <Section variant="callout" padding="sm">
          <Text noMargin>
            This heading and callout stay together as one atomic block when the
            document flows onto another page.
          </Text>
        </Section>
      </KeepTogether>
      <KeepTogether minPresenceAhead={80}>
        <Heading level={3}>Subsection Heading</Heading>
        <Text>
          Reserve enough room before starting this subsection so its heading is
          never stranded at the bottom of a page.
        </Text>
      </KeepTogether>
      <KeepTogether>
        <Heading level={4}>Signature Block</Heading>
        <Section variant="card" padding="sm">
          <Text noMargin>Approved by: ____________________</Text>
        </Section>
      </KeepTogether>
    </Section>`,
    margin: 40,
  },
  "key-value": {
    imports: ["KeyValue"],
    jsx: `<KeyValue
      direction="horizontal"
      divided
      items={[
        { key: "Invoice #", value: "INV-2026-0042" },
        { key: "Issue Date", value: "15 February 2026" },
        { key: "Due Date", value: "17 March 2026" },
        { key: "Status", value: "Unpaid", valueColor: "destructive" },
        { key: "Total", value: "$4,200.00", valueColor: "primary" },
      ]}
    />`,
    margin: 40,
  },
  link: {
    imports: ["Link", "Section"],
    jsx: `<Section spacing="none">
      <Link href="https://pdfcn.dev">Documentation</Link>
      <Link href="#section-1" color="primary">
        Internal link
      </Link>
    </Section>`,
    margin: 30,
  },
  list: {
    imports: ["PdfList"],
    jsx: `<PdfList
      variant="bullet"
      items={[
        {
          text: "Design system alignment",
          description: "Match all components to the design specification.",
        },
        {
          text: "Component implementation",
          description: "Build PDF-native components for both renderer bases.",
        },
        {
          text: "Write unit tests",
          description: "Cover all variants and edge cases.",
        },
      ]}
    />`,
    margin: 40,
  },
  "page-break": {
    imports: ["Heading", "PageBreak", "Text"],
    jsx: `<View>
      <Heading level={1}>Section 1</Heading>
      <Text>Content on the first page.</Text>
      <PageBreak />
      <Heading level={1}>Section 2</Heading>
      <Text>Content on the second page.</Text>
    </View>`,
    margin: 30,
  },
  "page-footer": {
    imports: ["PageFooter", "Text"],
    jsx: `<View
      style={{ display: "flex", flexDirection: "column", minHeight: 220 }}
    >
      <Text
        style={{ color: "#555555", fontSize: 10, lineHeight: 1.6, marginBottom: 6 }}
      >
        Invoice #1042 · Acme Corp · March 2026
      </Text>
      <Text
        style={{ color: "#555555", fontSize: 10, lineHeight: 1.6, marginBottom: 6 }}
      >
        The footer remains visually separated from the document body.
      </Text>
      <View style={{ flex: 1 }} />
      <PageFooter
        leftText="© 2026 Acme Corp"
        centerText="Confidential"
        rightText="Page 1 of 1"
        variant="simple"
      />
    </View>`,
    margin: 30,
    size: { height: 300, width: 595 },
  },
  "page-header": {
    imports: ["PageHeader", "Text"],
    jsx: `<View>
      <PageHeader
        title="Invoice #1042"
        subtitle="Acme Corp"
        rightText="March 2026"
        rightSubText="Due: 2026-03-31"
        variant="simple"
      />
      <Text
        style={{ color: "#555555", fontSize: 10, lineHeight: 1.6, marginBottom: 6 }}
      >
        Prepared for Northwind Industries
      </Text>
      <Text
        style={{ color: "#555555", fontSize: 10, lineHeight: 1.6, marginBottom: 6 }}
      >
        This document demonstrates the simple page header variant.
      </Text>
    </View>`,
    margin: 30,
    size: { height: 240, width: 595 },
  },
  "page-number": {
    imports: ["Heading", "PdfPageNumber", "Text"],
    jsx: `<View style={{ minHeight: 680, position: "relative" }}>
      <View style={{ marginBottom: 60 }}>
        <Heading level={1}>Multi-Page Report</Heading>
        <Text>
          Page numbers make long reports easier to review, reference, and print.
        </Text>
        <Text>
          The format token displays the current page together with the total page count.
        </Text>
      </View>
      <View
        style={{ bottom: 0, left: 0, position: "absolute", right: 0 }}
      >
        <PdfPageNumber format="Page 1 of 1" align="center" />
      </View>
    </View>`,
    margin: 40,
  },
  "pdf-image": {
    extraImports: `import { PREVIEW_IMAGE_DATA_URI } from "@/examples/preview-assets";`,
    imports: ["PdfImage"],
    jsx: `<PdfImage
      src={PREVIEW_IMAGE_DATA_URI}
      variant="default"
      height={120}
      width={200}
      caption="Variant: default"
    />`,
    margin: 40,
  },
  qrcode: {
    imports: ["Heading", "PdfQRCode", "Section", "Stack", "Text"],
    jsx: `<Section spacing="none">
      <Heading level={1}>Invoice #12345</Heading>
      <Text>Amount Due: $500.00</Text>
      <Section>
        <Stack direction="horizontal" gap="lg" align="start">
          <PdfQRCode
            value="https://pdfcn.dev/pay/invoice-12345"
            size={100}
            caption="Scan to pay"
          />
          <PdfQRCode
            value="https://pdfcn.dev/verify/invoice-12345"
            size={80}
            caption="Verify document"
          />
        </Stack>
      </Section>
      <Text variant="sm" color="mutedForeground">
        QR codes are rendered as crisp vector graphics in the generated PDF.
      </Text>
    </Section>`,
    margin: 40,
  },
  section: {
    imports: ["Heading", "Section", "Text"],
    jsx: `<Section spacing="none">
      <Section spacing="lg">
        <Heading level={2}>Introduction</Heading>
        <Text>This section uses generous spacing for a primary document area.</Text>
      </Section>
      <Section spacing="md">
        <Heading level={2}>Details</Heading>
        <Text>This section groups related content with medium spacing.</Text>
      </Section>
    </Section>`,
    margin: 30,
  },
  signature: {
    imports: ["PdfSignatureBlock"],
    jsx: `<PdfSignatureBlock
      variant="single"
      label="Authorized By"
      name="John Doe"
      title="CEO, Acme Corp"
      date="15 February 2026"
    />`,
    margin: 40,
  },
  stack: {
    imports: ["Divider", "Heading", "Stack", "Text"],
    jsx: `<Stack gap="md">
      <Heading level={2}>Section</Heading>
      <Text>First paragraph in the stack.</Text>
      <Text>Second paragraph with consistent spacing.</Text>
      <Divider spacing="lg" />
      <Stack gap="lg">
        <Heading level={3}>Wider gap</Heading>
        <Text>Content grouped with a larger vertical rhythm.</Text>
      </Stack>
    </Stack>`,
    margin: 30,
  },
  table: {
    imports: [
      "Table",
      "TableBody",
      "TableCell",
      "TableFooter",
      "TableHeader",
      "TableRow",
    ],
    jsx: `<Table variant="line" zebraStripe={false}>
      <TableHeader>
        <TableRow header>
          <TableCell>Item</TableCell>
          <TableCell align="center">Qty</TableCell>
          <TableCell align="right">Price</TableCell>
          <TableCell align="right">Total</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Design</TableCell>
          <TableCell align="center">1</TableCell>
          <TableCell align="right">$150.00</TableCell>
          <TableCell align="right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Development</TableCell>
          <TableCell align="center">1</TableCell>
          <TableCell align="right">$2,500.00</TableCell>
          <TableCell align="right">$2,500.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Testing</TableCell>
          <TableCell align="center">1</TableCell>
          <TableCell align="right">$800.00</TableCell>
          <TableCell align="right">$800.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow footer>
          <TableCell>Total</TableCell>
          <TableCell> </TableCell>
          <TableCell> </TableCell>
          <TableCell align="right">$3,450.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>`,
    margin: 40,
  },
  text: {
    imports: ["Section", "Text"],
    jsx: `<Section spacing="none">
      <Text>
        Default body text for paragraphs, descriptions, and document content.
      </Text>
      <Text variant="xs" color="mutedForeground">
        Caption text for metadata and supporting details.
      </Text>
      <Text variant="lg">Lead paragraph with a larger typographic scale.</Text>
    </Section>`,
    margin: 30,
  },
  watermark: {
    imports: ["Heading", "PdfWatermark", "Text"],
    jsx: `<View style={{ minHeight: 680, position: "relative" }}>
      <PdfWatermark text="DRAFT" />
      <Heading level={1}>Draft Document</Heading>
      <Text>
        This report is under review and should not be distributed externally.
      </Text>
      <Text>
        The watermark sits behind the content while remaining clearly visible.
      </Text>
      <Text>
        Use watermarks for draft, confidential, sample, or approval states.
      </Text>
    </View>`,
    margin: 40,
  },
};

const referenceDemoForComponent = (base, name) => {
  const config = REFERENCE_COMPONENT_DEMOS[name];
  if (!config) {
    return demoForComponent(base, name);
  }

  const isForme = base === "forme";
  const size = config.size ?? "A4";
  const sizeExpression =
    typeof size === "string"
      ? `"${size}"`
      : `{{ width: ${size.width}, height: ${size.height} }}`;
  const primitiveNames = [
    "Document",
    "Page",
    ...(config.jsx.includes("<View") ? ["View"] : []),
  ];
  const primitiveImport = isForme
    ? `import { ${primitiveNames.join(", ")} } from "@formepdf/react";`
    : `import { ${primitiveNames.join(", ")} } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";`;
  const providerOpen = isForme ? "" : "        <PdfcnThemeProvider>\n";
  const providerClose = isForme ? "" : "        </PdfcnThemeProvider>\n";
  const marginProp = isForme ? ` margin={${config.margin}}` : "";

  const extraImports = config.extraImports ? `\n${config.extraImports}` : "";

  return `${primitiveImport}${extraImports}
import { ${config.imports.join(", ")} } from "@/registry/bases/${base}/components";

const DemoBody = () => (
  ${config.jsx}
);

const Demo = () => {
  return (
    <Document>
      <Page size=${sizeExpression}${marginProp}>
${providerOpen}        <DemoBody />
${providerClose}      </Page>
    </Document>
  );
};

export default Demo;
`;
};

const demoForBlock = (base, name) => {
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
  const match = src.match(/export (?:const|function) (\w+)/);
  const fn = match?.[1] ?? exp;

  return `import { ${fn} } from "@/registry/bases/${base}/blocks/${name}/${name}";

const Demo =() => {
  return <${fn} />;
}
export default Demo;
`;
};

const collectFiles = (base, kind, name) => {
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
};

const libFiles = (base) => {
  const files = [
    "pdfcn-theme.ts",
    "pdfcn-theme-context.tsx",
    "resolve-color.ts",
  ];
  if (base === "takumi") {
    files.push("takumi-primitives.tsx", "takumi-svg.tsx");
  } else {
    files.push("forme-primitives.tsx", "forme-svg.tsx", "maybe-fixed.tsx");
  }
  return files
    .filter((f) =>
      fs.existsSync(path.join(ROOT, `registry/bases/${base}/lib/${f}`))
    )
    .map((f) => ({
      path: `registry/bases/${base}/lib/${f}`,
      type: "registry:lib",
    }));
};

const main = () => {
  const items = [];
  const demoImports = { forme: [], takumi: [] };

  fs.writeFileSync(
    path.join(ROOT, "examples/preview-assets.ts"),
    `export const PREVIEW_IMAGE_DATA_URI = ${JSON.stringify(PREVIEW_IMAGE_DATA_URI)};

export const replacePreviewImageSources = <T>(value: T): T => {
  if (value === "/favicon.png") {
    return PREVIEW_IMAGE_DATA_URI as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replacePreviewImageSources(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        replacePreviewImageSources(item),
      ])
    ) as T;
  }
  return value;
};
`
  );

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
      fs.writeFileSync(demoPath, referenceDemoForComponent(base, name));
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
    for (const name of demoImports[base].toSorted()) {
      const ident = `${base}_${name.replaceAll("-", "_")}`;
      indexSrc += `import ${ident} from "@/examples/${base}/${name}";\n`;
    }
  }
  indexSrc += `\ntype DemoMap = Record<string, ComponentType>;\n\nexport const demos: Record<BaseName, DemoMap> = {\n`;
  for (const base of ["takumi", "forme"]) {
    indexSrc += `  ${base}: {\n`;
    for (const name of demoImports[base].toSorted()) {
      const ident = `${base}_${name.replaceAll("-", "_")}`;
      indexSrc += `    "${name}": ${ident},\n`;
    }
    indexSrc += `  },\n`;
  }
  indexSrc += `};\n\nexport type DemoName = string;\n`;
  fs.writeFileSync(path.join(ROOT, "examples/__index__.ts"), indexSrc);

  console.log("items:", items.length);
  console.log("demos takumi:", demoImports.takumi.length);
  console.log("demos forme:", demoImports.forme.length);
};

main();
