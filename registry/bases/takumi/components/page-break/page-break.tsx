import { View } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import type { PDFComponentProps } from "@/registry/themes";

export interface PageBreakProps extends Omit<PDFComponentProps, "children"> {
  children?: never;
}

export const PageBreak = ({ style }: PageBreakProps) => (
  <View style={[{ breakBefore: "page" }, style].filter(Boolean) as never} />
);
