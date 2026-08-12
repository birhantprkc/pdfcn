import { Document, Page } from "@formepdf/react";

import { PdfAlert } from "@/registry/bases/forme/components/alert";
import { Heading } from "@/registry/bases/forme/components/heading";
import { Section } from "@/registry/bases/forme/components/section";
import { Text } from "@/registry/bases/forme/components/text";

const DemoBody = () => (
  <Section spacing="none">
    <Heading level={1}>Document Alerts</Heading>
    <Text>
      The PdfAlert component displays callout boxes with different severity
      levels.
    </Text>
    <Section>
      <PdfAlert variant="info" title="Information">
        This document contains important information about your account.
      </PdfAlert>
      <PdfAlert variant="success" title="Success">
        Your payment has been processed successfully.
      </PdfAlert>
      <PdfAlert variant="warning" title="Warning">
        Please review the terms and conditions before proceeding.
      </PdfAlert>
      <PdfAlert variant="error" title="Error">
        Missing required fields. Please complete all sections.
      </PdfAlert>
    </Section>
  </Section>
);

const Demo = () => (
  <Document>
    <Page size="A4" margin={40}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
