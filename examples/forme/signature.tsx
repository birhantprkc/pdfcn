import { Document, Page } from "@formepdf/react";

import { PdfSignatureBlock } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <PdfSignatureBlock
    variant="single"
    label="Authorized By"
    name="John Doe"
    title="CEO, Acme Corp"
    date="15 February 2026"
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
