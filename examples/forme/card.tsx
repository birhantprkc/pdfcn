import { Document, Page } from "@formepdf/react";

import { PdfCard } from "@/registry/bases/forme/components/card";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => <PdfCard title="Card">Card body</PdfCard>;

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
