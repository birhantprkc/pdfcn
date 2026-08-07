import { Document, Page } from "@formepdf/react";

import { PdfForm } from "@/registry/bases/forme/components/form";
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
    <PdfForm
      title="Contact"
      groups={[{ fields: [{ label: "Email" }, { label: "Phone" }] }]}
    />
  );
}
