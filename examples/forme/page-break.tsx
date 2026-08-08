import { Document, Page } from "@formepdf/react";

import { PageBreak } from "@/registry/bases/forme/components/page-break";
import { Text } from "@/registry/bases/forme/components/text";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => (
  <>
    <Text>Before</Text>
    <PageBreak />
    <Text>After</Text>
  </>
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
