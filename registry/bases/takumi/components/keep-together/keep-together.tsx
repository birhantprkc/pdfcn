import type { ReactNode } from "react";

import type { Style } from "@/registry/themes";

import { View } from "../../lib/takumi-primitives";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export function KeepTogether({ children, style }: KeepTogetherProps) {
  return (
    <View style={[{ breakInside: "avoid" }, style].filter(Boolean) as never}>
      {children}
    </View>
  );
}
