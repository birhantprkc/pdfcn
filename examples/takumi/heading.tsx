import { Heading, Section } from "@/registry/bases/takumi/components";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";

const DemoBody = () => (
  <Section spacing="none">
    <Heading level={1}>Main Title</Heading>
    <Heading level={2} align="center" color="primary">
      Subtitle
    </Heading>
    <Heading level={3} style={{ color: "#1e3a5f" }}>
      Custom Styled
    </Heading>
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
