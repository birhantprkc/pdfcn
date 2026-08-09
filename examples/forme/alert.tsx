import { Document, Page } from "@formepdf/react";
import { PdfAlert } from "@/registry/bases/forme/components/alert";


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
  return <PdfAlert variant="info" title="Info">Alert body</PdfAlert>;
}
