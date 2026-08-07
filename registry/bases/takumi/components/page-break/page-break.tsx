import type { PDFComponentProps } from "@/registry/themes";

import { View } from "../../lib/takumi-primitives";

export interface PageBreakProps extends Omit<PDFComponentProps, "children"> {
  children?: never;
}

export function PageBreak({ style }: PageBreakProps) {
  return (
    <View style={[{ breakBefore: "page" }, style].filter(Boolean) as never} />
  );
}
