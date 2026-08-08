import { Document, Page } from "@formepdf/react";

import { PdfForm } from "@/registry/bases/forme/components/form";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => (
  <PdfForm
    title="Contact"
    groups={[{ fields: [{ label: "Email" }, { label: "Phone" }] }]}
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
