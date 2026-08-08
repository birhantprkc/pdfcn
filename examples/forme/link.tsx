import { Document, Page } from "@formepdf/react";

import { Link } from "@/registry/bases/forme/components/link";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const Demo = () => (
  <Document>
    <Page size="A4" margin={48}>
      <PdfcnThemeProvider>
        <Link href="https://example.com">Example</Link>
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
