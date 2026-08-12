import { PdfList } from "@/registry/bases/takumi/components/list";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdf-primitives";

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
    <Page size="A4">
      <PdfcnThemeProvider>
        <DemoBody />
      </PdfcnThemeProvider>
    </Page>
  </Document>
);

export default Demo;
