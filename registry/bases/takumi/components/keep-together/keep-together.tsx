import type { ReactNode } from "react";

import { View } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import type { Style } from "@/registry/themes";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export const KeepTogether = ({ children, style }: KeepTogetherProps) => (
  <View style={[{ breakInside: "avoid" }, style].filter(Boolean) as never}>
    {children}
  </View>
);
