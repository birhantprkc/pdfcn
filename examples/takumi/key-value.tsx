import { KeyValue } from "@/registry/bases/takumi/components";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

const DemoBody = () => (
  <KeyValue
    direction="horizontal"
    divided
    items={[
      { key: "Invoice #", value: "INV-2026-0042" },
      { key: "Issue Date", value: "15 February 2026" },
      { key: "Due Date", value: "17 March 2026" },
      { key: "Status", value: "Unpaid", valueColor: "destructive" },
      { key: "Total", value: "$4,200.00", valueColor: "primary" },
    ]}
  />
);

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
