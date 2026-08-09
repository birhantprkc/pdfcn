import { Document, Page } from "@formepdf/react";
import { PageBreak } from "@/registry/bases/forme/components/page-break";
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
    <>
      <Text>Before</Text>
      <PageBreak />
      <Text>After</Text>
    </>
  );
}
