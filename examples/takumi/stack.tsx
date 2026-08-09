import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Stack } from "@/registry/bases/takumi/components/stack";
import { Text } from "@/registry/bases/takumi/components/text";


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
    <Stack gap="md">
      <Text>One</Text>
      <Text>Two</Text>
    </Stack>
  );
}
