import {
  Heading,
  KeepTogether,
  Section,
  Text,
} from "@/registry/bases/takumi/components";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

const DemoBody = () => (
  <Section spacing="none">
    <KeepTogether>
      <Heading level={2}>Section Title</Heading>
      <Section variant="callout" padding="sm">
        <Text noMargin>
          This heading and callout stay together as one atomic block when the
          document flows onto another page.
        </Text>
      </Section>
    </KeepTogether>
    <KeepTogether minPresenceAhead={80}>
      <Heading level={3}>Subsection Heading</Heading>
      <Text>
        Reserve enough room before starting this subsection so its heading is
        never stranded at the bottom of a page.
      </Text>
    </KeepTogether>
    <KeepTogether>
      <Heading level={4}>Signature Block</Heading>
      <Section variant="card" padding="sm">
        <Text noMargin>Approved by: ____________________</Text>
      </Section>
    </KeepTogether>
  </Section>
);

const Demo = () => (
  <Document>
    <Page size="A4">
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);

export default Demo;
