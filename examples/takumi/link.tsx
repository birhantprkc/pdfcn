import { Link } from "@/registry/bases/takumi/components/link";
import { Section } from "@/registry/bases/takumi/components/section";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdf-primitives";

const DemoBody = () => (
  <Section spacing="none">
    <Link href="https://pdfcn.dev">Documentation</Link>
    <Link href="#section-1" color="primary">
      Internal link
    </Link>
  </Section>
);

const Demo = () => (
  <Document>
    <Page size="A4">
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);

export default Demo;
