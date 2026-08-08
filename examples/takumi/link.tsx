import { Link } from "@/registry/bases/takumi/components/link";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

const Demo = () => (
  <Document>
    <Page size="A4">
      <PdfcnThemeProvider>
        <Link href="https://example.com">Example</Link>
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
