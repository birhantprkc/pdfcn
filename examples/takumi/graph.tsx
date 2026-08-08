import { PdfGraph } from "@/registry/bases/takumi/components/graph";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

const DemoBody = () => (
  <PdfGraph
    variant="bar"
    data={[
      { label: "Q1", value: 30 },
      { label: "Q2", value: 45 },
      { label: "Q3", value: 28 },
    ]}
  />
);

const Demo = () => (
  <Document>
    <Page size="A4">
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
