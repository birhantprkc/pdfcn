import { Document, Page } from "@formepdf/react";

import { Text } from "@/registry/bases/forme/components/text";
import { PdfWatermark } from "@/registry/bases/forme/components/watermark";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => (
  <>
    <PdfWatermark text="DRAFT" />
    <Text>Document content</Text>
  </>
);

const Demo = () => (
  <Document>
    <Page size="A4" margin={48}>
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
