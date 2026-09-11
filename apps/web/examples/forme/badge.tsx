import { Document, Page, View } from "@formepdf/react";

import { Badge } from "@/registry/bases/forme/components/badge/badge";

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
    <Page size={{ height: 200, width: 595 }} margin={40}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
