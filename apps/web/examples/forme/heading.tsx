import { Document, Page } from "@formepdf/react";

import { Heading } from "@/registry/bases/forme/components/heading/heading";
import { Section } from "@/registry/bases/forme/components/section/section";

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

const Demo = () => (
  <Document>
    <Page size="A4" margin={30}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
