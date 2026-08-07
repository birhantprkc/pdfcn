import { Document, Page } from "@formepdf/react";

import { KeyValue } from "@/registry/bases/forme/components/key-value";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

export default function Demo() {
  return (
    <Document>
      <Page size="A4" margin={48}>
        <PdfcnThemeProvider>
          <KeyValue items={[{ key: "Name", value: "Ada" }]} />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}
