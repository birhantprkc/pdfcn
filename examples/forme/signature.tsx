import { Document, Page } from "@formepdf/react";
import { PdfSignatureBlock } from "@/registry/bases/forme/components/signature";


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
  return <PdfSignatureBlock name="Jane Doe" label="Authorized Signature" />;
}
