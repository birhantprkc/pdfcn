import { PageBreak as FormePageBreak } from "@formepdf/react";

import type { PDFComponentProps } from "@/registry/themes";

export interface PageBreakProps extends Omit<PDFComponentProps, "children"> {
  children?: never;
}

export function PageBreak(_props: PageBreakProps) {
  return <FormePageBreak />;
}
