import { Document, Page } from "@formepdf/react";

import { Divider } from "@/registry/bases/forme/components/divider";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => <Divider />;

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
