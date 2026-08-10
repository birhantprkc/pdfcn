import { PageHeader, Text } from "@/registry/bases/takumi/components";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/takumi-primitives";

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

const Demo = () => {
  return (
    <Document>
      <Page size={{ width: 595, height: 240 }}>
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};

export default Demo;
