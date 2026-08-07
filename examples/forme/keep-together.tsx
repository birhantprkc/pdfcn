import { Document, Page } from "@formepdf/react";

import { KeepTogether } from "@/registry/bases/forme/components/keep-together";
import { Text } from "@/registry/bases/forme/components/text";
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
    <KeepTogether>
      <Text>Keep these lines together on one page.</Text>
    </KeepTogether>
  );
}
