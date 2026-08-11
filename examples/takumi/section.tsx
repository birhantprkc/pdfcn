import { Heading, Section, Text } from "@/registry/bases/takumi/components";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";

const DemoBody = () => (
  <Section spacing="none">
    <Section spacing="lg">
      <Heading level={2}>Introduction</Heading>
      <Text>
        This section uses generous spacing for a primary document area.
      </Text>
    </Section>
    <Section spacing="md">
      <Heading level={2}>Details</Heading>
      <Text>This section groups related content with medium spacing.</Text>
    </Section>
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
