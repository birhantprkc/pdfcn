import { Document, Page, View } from "@formepdf/react";

import { PageHeader } from "@/registry/bases/forme/components/page-header/page-header";
import { Text } from "@/registry/bases/forme/components/text/text";

const DemoBody = () => (
  <View>
    <PageHeader
      title="Invoice #1042"
      subtitle="Acme Corp"
      rightText="March 2026"
      rightSubText="Due: 2026-03-31"
      variant="simple"
    />
    <Text
      style={{
        color: "#555555",
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 6,
      }}
    >
      Prepared for Northwind Industries
    </Text>
    <Text
      style={{
        color: "#555555",
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 6,
      }}
    >
      This document demonstrates the simple page header variant.
    </Text>
  </View>
);

const Demo = () => (
  <Document>
    <Page size={{ height: 240, width: 595 }} margin={30}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
