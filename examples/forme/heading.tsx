import { Document, Page } from "@formepdf/react";
import { Heading } from "@/registry/bases/forme/components/heading";


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
  return <Heading level={1}>Heading</Heading>;
}
