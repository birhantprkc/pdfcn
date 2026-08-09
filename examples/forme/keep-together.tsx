import { Document, Page } from "@formepdf/react";
import { KeepTogether } from "@/registry/bases/forme/components/keep-together";
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
    <KeepTogether>
      <Text>Keep these lines together on one page.</Text>
    </KeepTogether>
  );
}
