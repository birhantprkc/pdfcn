import { Document, Page } from "@formepdf/react";
import { Stack } from "@/registry/bases/forme/components/stack";
import { Text } from "@/registry/bases/forme/components/text";


const Demo =() => {
  return (
    <Document>
      <Page size="A4" margin={48}>
        <DemoBody />
      </Page>
    </Document>
  );
}
export default Demo;

function DemoBody() {
  return (
    <Stack gap="md">
      <Text>One</Text>
      <Text>Two</Text>
    </Stack>
  );
}
