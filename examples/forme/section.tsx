import { Document, Page } from "@formepdf/react";
import { Section } from "@/registry/bases/forme/components/section";
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
  return <Section><Text>Section body</Text></Section>;
}
