import { Heading } from "@/registry/bases/takumi/components/heading";
import { Text } from "@/registry/bases/takumi/components/text";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import { PdfWatermark } from "@/registry/bases/takumi/components/watermark";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdf-primitives";

const DemoBody = () => (
  <View style={{ minHeight: 680, position: "relative" }}>
    <PdfWatermark text="DRAFT" />
    <Heading level={1}>Draft Document</Heading>
    <Text>
      This report is under review and should not be distributed externally.
    </Text>
    <Text>
      The watermark sits behind the content while remaining clearly visible.
    </Text>
    <Text>
      Use watermarks for draft, confidential, sample, or approval states.
    </Text>
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
