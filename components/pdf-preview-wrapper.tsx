"use client";

import dynamic from "next/dynamic";

const PdfPreview = dynamic(
  async () => {
    const mod = await import("@/components/pdf-preview");
    return mod.PdfPreview;
  },
  { ssr: false }
);

export { PdfPreview };
