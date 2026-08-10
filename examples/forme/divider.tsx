import { Document, Page, View } from "@formepdf/react";

import { Divider, Heading, Text } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <View>
    <Heading level={2}>Section 1</Heading>
    <Text>Content here.</Text>
    <Divider />
    <Heading level={2}>Section 2</Heading>
    <Text>More content.</Text>
    <Divider variant="dashed" />
    <Heading level={2}>Section 3</Heading>
    <Text>More content.</Text>
    <Divider variant="dotted" />
    <Heading level={2}>Section 4</Heading>
    <Text>More content.</Text>
    <Divider label="Section Divider" />
    <Heading level={2}>Section 5</Heading>
    <Text>More content.</Text>
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
