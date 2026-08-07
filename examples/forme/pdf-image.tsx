import { Document, Page } from "@formepdf/react";

import { PdfImage } from "@/registry/bases/forme/components/pdf-image";
import { Text } from "@/registry/bases/forme/components/text";
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
  return <Text>PdfImage demo — pass src in your document.</Text>;
}
