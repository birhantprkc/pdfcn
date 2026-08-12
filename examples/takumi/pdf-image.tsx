import { PREVIEW_IMAGE_DATA_URI } from "@/examples/preview-assets";
import { PdfImage } from "@/registry/bases/takumi/components/pdf-image";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/components/theme-provider";
import { Document, Page } from "@/registry/bases/takumi/lib/pdf-primitives";

const DemoBody = () => (
  <PdfImage
    src={PREVIEW_IMAGE_DATA_URI}
    variant="default"
    height={120}
    width={200}
    caption="Variant: default"
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
