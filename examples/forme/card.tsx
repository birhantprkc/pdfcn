import { Document, Page } from "@formepdf/react";

import { PdfCard, Text } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <PdfCard title="Project Summary" variant="default" padding="md">
    <Text noMargin>
      This card groups related content with a title and body area. Use cards to
      visually separate sections of your PDF document.
    </Text>
  </PdfCard>
);

const Demo = () => (
  <Document>
    <Page size="A4" margin={40}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
