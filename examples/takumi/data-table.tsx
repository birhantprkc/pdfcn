import { DataTable } from "@/registry/bases/takumi/components/data-table";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

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
    <Page size="A4">
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);
export default Demo;
