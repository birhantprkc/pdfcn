import { Document, Page } from "@formepdf/react";

import { Text } from "@/registry/bases/forme/components/text";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => <Text>PdfImage demo — pass src in your document.</Text>;

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
