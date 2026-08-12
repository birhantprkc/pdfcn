import { Document, Page } from "@formepdf/react";

import { PdfList } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <PdfList
    variant="bullet"
    items={[
      {
        description: "Match all components to the design specification.",
        text: "Design system alignment",
      },
      {
        description: "Build PDF-native components for both renderer bases.",
        text: "Component implementation",
      },
      {
        description: "Cover all variants and edge cases.",
        text: "Write unit tests",
      },
    ]}
  />
);

const Demo = () => (
  <Document>
    <Page size="A4" margin={40}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
