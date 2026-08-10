import { Document, Page } from "@formepdf/react";

import {
  Heading,
  KeepTogether,
  Section,
  Text,
} from "@/registry/bases/forme/components";

const DemoBody = () => (
  <Section spacing="none">
    <KeepTogether>
      <Heading level={2}>Section Title</Heading>
      <Section variant="callout" padding="sm">
        <Text noMargin>
          This heading and callout stay together as one atomic block when the
          document flows onto another page.
        </Text>
      </Section>
    </KeepTogether>
    <KeepTogether minPresenceAhead={80}>
      <Heading level={3}>Subsection Heading</Heading>
      <Text>
        Reserve enough room before starting this subsection so its heading is
        never stranded at the bottom of a page.
      </Text>
    </KeepTogether>
    <KeepTogether>
      <Heading level={4}>Signature Block</Heading>
      <Section variant="card" padding="sm">
        <Text noMargin>Approved by: ____________________</Text>
      </Section>
    </KeepTogether>
  </Section>
);

const Demo = () => {
  return (
    <Document>
      <Page size="A4" margin={40}>
        <DemoBody />
      </Page>
    </Document>
  );
};

export default Demo;
