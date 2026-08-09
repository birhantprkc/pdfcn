import { Document, Page } from "@formepdf/react";
import { PdfImage } from "@/registry/bases/forme/components/pdf-image";
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
  return <Text>PdfImage demo — pass src in your document.</Text>;
}
