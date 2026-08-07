import { DataTable } from "@/registry/bases/takumi/components/data-table";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

export default function Demo() {
  return (
    <Document>
      <Page size="A4">
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
