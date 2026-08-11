import type { ReactNode } from "react";

import { View } from "@/registry/bases/forme/lib/forme-primitives";
import type { Style } from "@/registry/themes";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export const KeepTogether = ({ children, style }: KeepTogetherProps) => (
  <View wrap={false} style={style as never}>
    {children}
  </View>
);
