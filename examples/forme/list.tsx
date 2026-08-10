import { Document, Page } from "@formepdf/react";

import { PdfList } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <PdfList
    variant="bullet"
    items={[
      {
        text: "Design system alignment",
        description: "Match all components to the design specification.",
      },
      {
        text: "Component implementation",
        description: "Build PDF-native components for both renderer bases.",
      },
      {
        text: "Write unit tests",
        description: "Cover all variants and edge cases.",
      },
    ]}
  />
);

const Demo = () => {
  return (
    <Document>
      <Page size="A4" margin={40}>
        <DemoBody />
      </Page>
    </Document>
  );
};

export default Demo;
