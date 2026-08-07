import { View } from "@formepdf/react";
import type { ReactNode } from "react";

import type { Style } from "@/registry/themes";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export function KeepTogether({ children, style }: KeepTogetherProps) {
  return (
    <View wrap={false} style={style as never}>
      {children}
    </View>
  );
}
