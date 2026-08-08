import { Document, Page } from "@formepdf/react";

import { PdfList } from "@/registry/bases/forme/components/list";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const Demo = () => (
  <Document>
    <Page size="A4" margin={48}>
      <PdfcnThemeProvider>
        <PdfList
          items={[{ text: "Alpha" }, { text: "Beta" }, { text: "Gamma" }]}
        />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
