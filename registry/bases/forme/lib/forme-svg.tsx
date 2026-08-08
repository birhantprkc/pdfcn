import { Svg as FormeSvg } from "@formepdf/react";
import { createElement } from "react";
import type { ReactNode, CSSProperties } from "react";

type AnyProps = Record<string, unknown> & {
  children?: ReactNode;
  style?: CSSProperties;
};

export const Svg = ({
  children,
  width,
  height,
  viewBox,
  style,
  ...rest
}: AnyProps & { width?: number; height?: number; viewBox?: string }) => (
  <FormeSvg
    width={width as number}
    height={height as number}
    viewBox={viewBox as string | undefined}
    style={style as never}
    {...rest}
  >
    {children}
  </FormeSvg>
);

export const Circle = (props: AnyProps) => createElement("circle", props);
export const Rect = (props: AnyProps) => createElement("rect", props);
export const G = (props: AnyProps) => createElement("g", props);
export const Line = (props: AnyProps) => createElement("line", props);
export const Path = (props: AnyProps) => createElement("path", props);
export const SvgText = (props: AnyProps) => createElement("text", props);
