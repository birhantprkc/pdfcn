import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Link } from "@/registry/bases/takumi/components/link";


const Demo =() => {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}
export default Demo;

function DemoBody() {
  return <Link href="https://example.com">Example</Link>;
}
