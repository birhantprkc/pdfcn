import { KeyValue } from "@/registry/bases/takumi/components/key-value";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

const Demo = () => (
  <Document>
    <Page size="A4">
      <PdfcnThemeProvider>
        <KeyValue items={[{ key: "Name", value: "Ada" }]} />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
