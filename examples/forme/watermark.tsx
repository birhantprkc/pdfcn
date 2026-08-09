import { Document, Page } from "@formepdf/react";
import { PdfWatermark } from "@/registry/bases/forme/components/watermark";
import { Text } from "@/registry/bases/forme/components/text";


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
  return (
    <>
      <PdfWatermark text="DRAFT" />
      <Text>Document content</Text>
    </>
  );
}
