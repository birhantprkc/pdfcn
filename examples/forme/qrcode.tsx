import { Document, Page } from "@formepdf/react";
import { PdfQRCode } from "@/registry/bases/forme/components/qrcode";


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
  return <PdfQRCode value="https://pdfcn.dev" />;
}
