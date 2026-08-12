import { Document, Page } from "@formepdf/react";

import { Link, Section } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <Section spacing="none">
    <Link href="https://pdfcn.dev">Documentation</Link>
    <Link href="#section-1" color="primary">
      Internal link
    </Link>
  </Section>
);

const Demo = () => (
  <Document>
    <Page size="A4" margin={30}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
