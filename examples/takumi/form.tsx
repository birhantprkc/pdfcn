import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { PdfForm } from "@/registry/bases/takumi/components/form";


const Demo =() => {
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
export default Demo;

function DemoBody() {
  return (
    <PdfForm
      title="Contact"
      groups={[{ fields: [{ label: "Email" }, { label: "Phone" }] }]}
    />
  );
}
