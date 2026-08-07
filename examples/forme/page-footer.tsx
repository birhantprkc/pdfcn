import { Document, Page } from "@formepdf/react";

import { PageFooter } from "@/registry/bases/forme/components/page-footer";
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
  return <PageFooter leftText="pdfcn" rightText="Confidential" />;
}
