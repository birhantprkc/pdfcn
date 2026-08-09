import { Document, Page } from "@formepdf/react";
import { PageHeader } from "@/registry/bases/forme/components/page-header";


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
  return <PageHeader title="Company" subtitle="Invoice" />;
}
