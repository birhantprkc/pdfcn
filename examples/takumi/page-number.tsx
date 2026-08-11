import {
  Heading,
  PdfPageNumber,
  Text,
} from "@/registry/bases/takumi/components";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

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
