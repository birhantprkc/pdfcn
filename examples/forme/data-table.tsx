import { Document, Page } from "@formepdf/react";
import { DataTable } from "@/registry/bases/forme/components/data-table";


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
    <DataTable
      columns={[
        { key: "name", header: "Name" },
        { key: "price", header: "Price" },
      ]}
      data={[
        { name: "Widget", price: "$10" },
        { name: "Gadget", price: "$20" },
      ]}
    />
  );
}
