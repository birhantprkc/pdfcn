import { Document, Page } from "@formepdf/react";
import { Divider } from "@/registry/bases/forme/components/divider";


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
  return <Divider />;
}
