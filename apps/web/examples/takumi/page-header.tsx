import { PageHeader } from "@/registry/bases/takumi/components/page-header/page-header";
import { Text } from "@/registry/bases/takumi/components/text/text";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdf-primitives";

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
    <Page size={{ height: 240, width: 595 }}>
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);

export default Demo;
