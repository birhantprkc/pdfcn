import { Badge } from "@/registry/bases/takumi/components";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

const DemoBody = () => (
  <View
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 12,
    }}
  >
    <Badge label="Small" variant="default" size="sm" />
    <Badge label="Medium" variant="default" size="md" />
    <Badge label="Large" variant="default" size="lg" />
  </View>
);

const Demo = () => (
  <Document>
    <Page size={{ height: 200, width: 595 }}>
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);

export default Demo;
