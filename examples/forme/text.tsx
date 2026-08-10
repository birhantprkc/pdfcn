import { Document, Page } from "@formepdf/react";

import { Section, Text } from "@/registry/bases/forme/components";

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

const Demo = () => {
  return (
    <Document>
      <Page size="A4" margin={30}>
        <DemoBody />
      </Page>
    </Document>
  );
};

export default Demo;
