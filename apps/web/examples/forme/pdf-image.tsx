import { Document, Page } from "@formepdf/react";

import { PREVIEW_IMAGE_DATA_URI } from "@/examples/preview-assets";
import { PdfImage } from "@/registry/bases/forme/components/pdf-image/pdf-image";

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
    <Page size="A4" margin={40}>
      <DemoBody />
    </Page>
  </Document>
);

export default Demo;
