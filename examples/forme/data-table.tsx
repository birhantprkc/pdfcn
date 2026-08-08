import { Document, Page } from "@formepdf/react";

import { DataTable } from "@/registry/bases/forme/components/data-table";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => (
  <DataTable
    columns={[
      { header: "Name", key: "name" },
      { header: "Price", key: "price" },
    ]}
    data={[
      { name: "Widget", price: "const Demo =0" },
      { name: "Gadget", price: "$20" },
    ]}
  />
);

const Demo = () => (
  <Document>
    <Page size="A4" margin={48}>
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
