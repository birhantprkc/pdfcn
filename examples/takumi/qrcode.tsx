import { Heading } from "@/registry/bases/takumi/components/heading";
import { PdfQRCode } from "@/registry/bases/takumi/components/qrcode";
import { Section } from "@/registry/bases/takumi/components/section";
import { Stack } from "@/registry/bases/takumi/components/stack";
import { Text } from "@/registry/bases/takumi/components/text";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdf-primitives";

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

const Demo = () => (
  <Document>
    <Page size="A4">
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);

export default Demo;
