import { Document, Page, View } from "@formepdf/react";

import { Heading } from "@/registry/bases/forme/components/heading";
import { PageBreak } from "@/registry/bases/forme/components/page-break";
import { Text } from "@/registry/bases/forme/components/text";

const DemoBody = () => (
  <View>
    <Heading level={1}>Section 1</Heading>
    <Text>Content on the first page.</Text>
    <PageBreak />
    <Heading level={1}>Section 2</Heading>
    <Text>Content on the second page.</Text>
  </View>
);

const Demo = () => (
  <Document>
    <Page size="A4" margin={30}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
