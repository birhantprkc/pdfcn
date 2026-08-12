import { Heading } from "@/registry/bases/takumi/components/heading/heading";
import { Section } from "@/registry/bases/takumi/components/section/section";
import { Text } from "@/registry/bases/takumi/components/text/text";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdf-primitives";

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
