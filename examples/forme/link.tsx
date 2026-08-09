import { Document, Page } from "@formepdf/react";
import { Link } from "@/registry/bases/forme/components/link";


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
  return <Link href="https://example.com">Example</Link>;
}
