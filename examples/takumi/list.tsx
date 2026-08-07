import { PdfList } from "@/registry/bases/takumi/components/list";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

export default function Demo() {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
          <PdfList
            items={[{ text: "Alpha" }, { text: "Beta" }, { text: "Gamma" }]}
          />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}
