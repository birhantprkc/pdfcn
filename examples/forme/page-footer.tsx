import { Document, Page } from "@formepdf/react";
import { PageFooter } from "@/registry/bases/forme/components/page-footer";


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
  return <PageFooter leftText="pdfcn" rightText="Confidential" />;
}
