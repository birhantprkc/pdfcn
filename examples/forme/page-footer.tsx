import { Document, Page, View } from "@formepdf/react";

import { PageFooter } from "@/registry/bases/forme/components/page-footer";
import { Text } from "@/registry/bases/forme/components/text";

const DemoBody = () => (
  <View style={{ display: "flex", flexDirection: "column", minHeight: 220 }}>
    <Text
      style={{
        color: "#555555",
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 6,
      }}
    >
      Invoice #1042 · Acme Corp · March 2026
    </Text>
    <Text
      style={{
        color: "#555555",
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 6,
      }}
    >
      The footer remains visually separated from the document body.
    </Text>
    <View style={{ flex: 1 }} />
    <PageFooter
      leftText="© 2026 Acme Corp"
      centerText="Confidential"
      rightText="Page 1 of 1"
      variant="simple"
    />
  </View>
);

const Demo = () => (
  <Document>
    <Page size={{ height: 300, width: 595 }} margin={30}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
