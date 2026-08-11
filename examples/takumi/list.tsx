import { PdfList } from "@/registry/bases/takumi/components";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

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
      <Page size="A4">
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};

export default Demo;
