import { Document, Page } from "@formepdf/react";

import { Link } from "@/registry/bases/forme/components/link";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

export default function Demo() {
  return (
    <Document>
      <Page size="A4" margin={48}>
        <PdfcnThemeProvider>
          <Link href="https://example.com">Example</Link>
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}
