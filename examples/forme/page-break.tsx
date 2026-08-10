import { Document, Page, View } from "@formepdf/react";

import { Heading, PageBreak, Text } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <View>
    <Heading level={1}>Section 1</Heading>
    <Text>Content on the first page.</Text>
    <PageBreak />
    <Heading level={1}>Section 2</Heading>
    <Text>Content on the second page.</Text>
  </View>
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
