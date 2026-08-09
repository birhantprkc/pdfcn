import { Document, Page } from "@formepdf/react";
import { KeyValue } from "@/registry/bases/forme/components/key-value";


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
  return <KeyValue items={[{ key: "Name", value: "Ada" }]} />;
}
