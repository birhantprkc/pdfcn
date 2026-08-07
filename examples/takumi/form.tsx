import { PdfForm } from "@/registry/bases/takumi/components/form";
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
    <PdfForm
      title="Contact"
      groups={[{ fields: [{ label: "Email" }, { label: "Phone" }] }]}
    />
  );
}
