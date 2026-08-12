import { PdfCard, Text } from "@/registry/bases/takumi/components";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

const DemoBody = () => (
  <PdfCard title="Project Summary" variant="default" padding="md">
    <Text noMargin>
      This card groups related content with a title and body area. Use cards to
      visually separate sections of your PDF document.
    </Text>
  </PdfCard>
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
