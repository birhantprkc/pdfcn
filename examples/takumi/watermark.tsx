import { Text } from "@/registry/bases/takumi/components/text";
import { PdfWatermark } from "@/registry/bases/takumi/components/watermark";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

const DemoBody = () => (
  <>
    <PdfWatermark text="DRAFT" />
    <Text>Document content</Text>
  </>
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
