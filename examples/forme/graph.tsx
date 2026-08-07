import { Document, Page } from "@formepdf/react";

import { PdfGraph } from "@/registry/bases/forme/components/graph";
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
    <PdfGraph
      variant="bar"
      data={[
        { label: "Q1", value: 30 },
        { label: "Q2", value: 45 },
        { label: "Q3", value: 28 },
      ]}
    />
  );
}
