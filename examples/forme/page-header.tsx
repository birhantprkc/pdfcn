import { Document, Page } from "@formepdf/react";

import { PageHeader } from "@/registry/bases/forme/components/page-header";
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
  return <PageHeader title="Company" subtitle="Invoice" />;
}
