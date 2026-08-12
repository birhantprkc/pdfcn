import { Document, Page } from "@formepdf/react";

import { PdfGraph } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <PdfGraph
    variant="bar"
    title="Monthly Revenue"
    subtitle="FY 2025"
    data={[
      { label: "Jan", value: 42_000 },
      { label: "Feb", value: 38_000 },
      { label: "Mar", value: 55_000 },
      { label: "Apr", value: 61_000 },
      { label: "May", value: 49_000 },
      { label: "Jun", value: 72_000 },
    ]}
    showValues
    width={480}
    height={260}
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
