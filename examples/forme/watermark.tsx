import { Document, Page, View } from "@formepdf/react";

import { Heading } from "@/registry/bases/forme/components/heading/heading";
import { Text } from "@/registry/bases/forme/components/text/text";
import { PdfWatermark } from "@/registry/bases/forme/components/watermark/watermark";

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
    <Page size="A4" margin={40}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
