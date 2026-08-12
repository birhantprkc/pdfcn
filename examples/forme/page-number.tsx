import { Document, Page, View } from "@formepdf/react";

import { Heading } from "@/registry/bases/forme/components/heading/heading";
import { PdfPageNumber } from "@/registry/bases/forme/components/page-number/page-number";
import { Text } from "@/registry/bases/forme/components/text/text";

const DemoBody = () => (
  <View style={{ minHeight: 680, position: "relative" }}>
    <View style={{ marginBottom: 60 }}>
      <Heading level={1}>Multi-Page Report</Heading>
      <Text>
        Page numbers make long reports easier to review, reference, and print.
      </Text>
      <Text>
        The format token displays the current page together with the total page
        count.
      </Text>
    </View>
    <View style={{ bottom: 0, left: 0, position: "absolute", right: 0 }}>
      <PdfPageNumber format="Page 1 of 1" align="center" />
    </View>
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
