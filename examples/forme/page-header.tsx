import { Document, Page } from "@formepdf/react";

import { PageHeader } from "@/registry/bases/forme/components/page-header";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => <PageHeader title="Company" subtitle="Invoice" />;

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
