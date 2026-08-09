import { Document, Page } from "@formepdf/react";
import { PdfPageNumber } from "@/registry/bases/forme/components/page-number";


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
  return <PdfPageNumber />;
}
