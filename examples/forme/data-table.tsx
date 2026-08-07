import { Document, Page } from "@formepdf/react";

import { DataTable } from "@/registry/bases/forme/components/data-table";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

export default function Demo() {
  return (
    <Document>
      <Page size="A4" margin={48}>
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}

function DemoBody() {
  return (
    <DataTable
      columns={[
        { header: "Name", key: "name" },
        { header: "Price", key: "price" },
      ]}
      data={[
        { name: "Widget", price: "$10" },
        { name: "Gadget", price: "$20" },
      ]}
    />
  );
}
