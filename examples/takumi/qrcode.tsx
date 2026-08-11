import {
  Heading,
  PdfQRCode,
  Section,
  Stack,
  Text,
} from "@/registry/bases/takumi/components";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

const DemoBody = () => (
  <Section spacing="none">
    <Heading level={1}>Invoice #12345</Heading>
    <Text>Amount Due: $500.00</Text>
    <Section>
      <Stack direction="horizontal" gap="lg" align="start">
        <PdfQRCode
          value="https://pdfcn.dev/pay/invoice-12345"
          size={100}
          caption="Scan to pay"
        />
        <PdfQRCode
          value="https://pdfcn.dev/verify/invoice-12345"
          size={80}
          caption="Verify document"
        />
      </Stack>
    </Section>
    <Text variant="sm" color="mutedForeground">
      QR codes are rendered as crisp vector graphics in the generated PDF.
    </Text>
  </Section>
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
