import { KeepTogether } from "@/registry/bases/takumi/components/keep-together";
import { Text } from "@/registry/bases/takumi/components/text";
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
    <KeepTogether>
      <Text>Keep these lines together on one page.</Text>
    </KeepTogether>
  );
}
