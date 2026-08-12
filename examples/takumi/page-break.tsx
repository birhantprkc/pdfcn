import { Heading } from "@/registry/bases/takumi/components/heading";
import { PageBreak } from "@/registry/bases/takumi/components/page-break";
import { Text } from "@/registry/bases/takumi/components/text";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdf-primitives";

const DemoBody = () => (
  <View>
    <Heading level={1}>Section 1</Heading>
    <Text>Content on the first page.</Text>
    <PageBreak />
    <Heading level={1}>Section 2</Heading>
    <Text>Content on the second page.</Text>
  </View>
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
