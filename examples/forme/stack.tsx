import { Document, Page } from "@formepdf/react";

import { Stack } from "@/registry/bases/forme/components/stack";
import { Text } from "@/registry/bases/forme/components/text";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const DemoBody = () => (
  <Stack gap="md">
    <Text>One</Text>
    <Text>Two</Text>
  </Stack>
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
