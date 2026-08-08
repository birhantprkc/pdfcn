import { Document, Page } from "@formepdf/react";

import { PdfQRCode } from "@/registry/bases/forme/components/qrcode";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => <PdfQRCode value="https://pdfcn.dev" />;

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
