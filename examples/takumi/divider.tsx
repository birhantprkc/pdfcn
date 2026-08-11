import { Divider, Heading, Text } from "@/registry/bases/takumi/components";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

const DemoBody = () => (
  <View>
    <Heading level={2}>Section 1</Heading>
    <Text>Content here.</Text>
    <Divider />
    <Heading level={2}>Section 2</Heading>
    <Text>More content.</Text>
    <Divider variant="dashed" />
    <Heading level={2}>Section 3</Heading>
    <Text>More content.</Text>
    <Divider variant="dotted" />
    <Heading level={2}>Section 4</Heading>
    <Text>More content.</Text>
    <Divider label="Section Divider" />
    <Heading level={2}>Section 5</Heading>
    <Text>More content.</Text>
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
