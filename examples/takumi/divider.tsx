import { Divider } from "@/registry/bases/takumi/components/divider";
import { Heading } from "@/registry/bases/takumi/components/heading";
import { Text } from "@/registry/bases/takumi/components/text";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdf-primitives";

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
