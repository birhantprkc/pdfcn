import { Document, Page } from "@formepdf/react";

import { PdfAlert } from "@/registry/bases/forme/components/alert";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => (
  <PdfAlert variant="info" title="Info">
    Alert body
  </PdfAlert>
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
