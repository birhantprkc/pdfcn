import { Document, Page } from "@formepdf/react";

import { PdfSignatureBlock } from "@/registry/bases/forme/components/signature";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

export default function Demo() {
  return (
    <Document>
      <Page size="A4" margin={48}>
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}

function DemoBody() {
  return <PdfSignatureBlock name="Jane Doe" label="Authorized Signature" />;
}
