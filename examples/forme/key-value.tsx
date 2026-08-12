import { Document, Page } from "@formepdf/react";

import { KeyValue } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <KeyValue
    direction="horizontal"
    divided
    items={[
      { key: "Invoice #", value: "INV-2026-0042" },
      { key: "Issue Date", value: "15 February 2026" },
      { key: "Due Date", value: "17 March 2026" },
      { key: "Status", value: "Unpaid", valueColor: "destructive" },
      { key: "Total", value: "$4,200.00", valueColor: "primary" },
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
