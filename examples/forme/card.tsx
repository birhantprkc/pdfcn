import { Document, Page } from "@formepdf/react";
import { PdfCard } from "@/registry/bases/forme/components/card";


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
  return <PdfCard title="Card">Card body</PdfCard>;
}
