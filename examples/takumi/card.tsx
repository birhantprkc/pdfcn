import { PdfCard, Text } from "@/registry/bases/takumi/components";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";

const DemoBody = () => (
  <PdfCard title="Project Summary" variant="default" padding="md">
    <Text noMargin>
      This card groups related content with a title and body area. Use cards to
      visually separate sections of your PDF document.
    </Text>
  </PdfCard>
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
