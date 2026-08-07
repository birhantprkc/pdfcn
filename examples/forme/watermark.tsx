import { Document, Page } from "@formepdf/react";

import { Text } from "@/registry/bases/forme/components/text";
import { PdfWatermark } from "@/registry/bases/forme/components/watermark";
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
  return (
    <>
      <PdfWatermark text="DRAFT" />
      <Text>Document content</Text>
    </>
  );
}
