import { Fixed, View } from "@formepdf/react";
import type { Style } from "@formepdf/react";
import type { ReactNode } from "react";

export function MaybeFixed({
  fixed,
  position,
  wrap,
  style,
  children,
}: {
  fixed?: boolean;
  position: "header" | "footer";
  wrap?: boolean;
  style?: Style | Style[];
  children?: ReactNode;
}) {
  const view = (
    <View wrap={wrap} style={style as never}>
      {children}
    </View>
  );
  if (!fixed) {
    return view;
  }
  return <Fixed position={position}>{view}</Fixed>;
}
