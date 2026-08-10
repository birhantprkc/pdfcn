import { Link, Section } from "@/registry/bases/takumi/components";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

const DemoBody = () => (
  <Section spacing="none">
    <Link href="https://pdfcn.dev">Documentation</Link>
    <Link href="#section-1" color="primary">
      Internal link
    </Link>
  </Section>
);

const Demo = () => {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};

export default Demo;
