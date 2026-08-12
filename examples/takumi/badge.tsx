import { Badge } from "@/registry/bases/takumi/components/badge";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import {
  Document,
  Page,
  View,
} from "@/registry/bases/takumi/lib/pdf-primitives";

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
