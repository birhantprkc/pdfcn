import { Document, Page } from "@formepdf/react";
import { PdfList } from "@/registry/bases/forme/components/list";


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
  return <PdfList items={[{ text: "Alpha" }, { text: "Beta" }, { text: "Gamma" }]} />;
}
