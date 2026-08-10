import type { ReactNode } from "react";

import type { Style } from "@/registry/themes";

import { View } from "../../lib/forme-primitives";

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
