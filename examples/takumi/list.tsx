import { PdfList } from "@/registry/bases/takumi/components/list";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

const Demo = () => (
  <Document>
    <Page size="A4">
      <PdfcnThemeProvider>
        <PdfList
          items={[{ text: "Alpha" }, { text: "Beta" }, { text: "Gamma" }]}
        />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
