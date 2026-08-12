import { Document, Page } from "@formepdf/react";

import { Divider } from "@/registry/bases/forme/components/divider";
import { Heading } from "@/registry/bases/forme/components/heading";
import { Stack } from "@/registry/bases/forme/components/stack";
import { Text } from "@/registry/bases/forme/components/text";

const DemoBody = () => (
  <Stack gap="md">
    <Heading level={2}>Section</Heading>
    <Text>First paragraph in the stack.</Text>
    <Text>Second paragraph with consistent spacing.</Text>
    <Divider spacing="lg" />
    <Stack gap="lg">
      <Heading level={3}>Wider gap</Heading>
      <Text>Content grouped with a larger vertical rhythm.</Text>
    </Stack>
  </Stack>
);

const Demo = () => (
  <Document>
    <Page size="A4" margin={30}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
