import { PageFooter, Text } from "@/registry/bases/takumi/components";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

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

const Demo = () => {
  return (
    <Document>
      <Page size={{ width: 595, height: 300 }}>
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};

export default Demo;
