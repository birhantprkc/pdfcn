import { Section } from "@/registry/bases/takumi/components/section";
import { Text } from "@/registry/bases/takumi/components/text";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdf-primitives";

const DemoBody = () => (
  <Section spacing="none">
    <Text>
      Default body text for paragraphs, descriptions, and document content.
    </Text>
    <Text variant="xs" color="mutedForeground">
      Caption text for metadata and supporting details.
    </Text>
    <Text variant="lg">Lead paragraph with a larger typographic scale.</Text>
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
