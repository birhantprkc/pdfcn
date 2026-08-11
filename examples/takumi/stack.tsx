import {
  Divider,
  Heading,
  Stack,
  Text,
} from "@/registry/bases/takumi/components";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

const DemoBody = () => (
  <Stack gap="md">
    <Heading level={2}>Section</Heading>
    <Text>First paragraph in the stack.</Text>
    <Text>Second paragraph with consistent spacing.</Text>
    <Divider spacing="lg" />
    <Stack gap="lg">
      <Heading level={3}>Wider gap</Heading>
      <Text>Content grouped with a larger vertical rhythm.</Text>
    </Stack>
  </Stack>
);

const Demo = () => {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};

export default Demo;
