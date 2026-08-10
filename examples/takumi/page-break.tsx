import { Heading, PageBreak, Text } from "@/registry/bases/takumi/components";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/takumi-primitives";

const DemoBody = () => (
  <View>
    <Heading level={1}>Section 1</Heading>
    <Text>Content on the first page.</Text>
    <PageBreak />
    <Heading level={1}>Section 2</Heading>
    <Text>Content on the second page.</Text>
  </View>
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
