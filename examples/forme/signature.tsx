import { Document, Page } from "@formepdf/react";

import { PdfSignatureBlock } from "@/registry/bases/forme/components/signature";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => (
  <PdfSignatureBlock name="Jane Doe" label="Authorized Signature" />
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
