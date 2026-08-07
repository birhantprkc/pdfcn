import type { CSSProperties, ReactNode, SVGProps } from "react";

export function Svg({
  children,
  style,
  ...rest
}: SVGProps<SVGSVGElement> & { style?: CSSProperties }) {
  return (
    <svg style={style} {...rest}>
      {children}
    </svg>
  );
}

export function Rect(props: SVGProps<SVGRectElement>) {
  return <rect {...props} />;
}
export function Circle(props: SVGProps<SVGCircleElement>) {
  return <circle {...props} />;
}
export function G(props: SVGProps<SVGGElement>) {
  return <g {...props} />;
}
export function Line(props: SVGProps<SVGLineElement>) {
  return <line {...props} />;
}
export function Path(props: SVGProps<SVGPathElement>) {
  return <path {...props} />;
}
export function SvgText({
  children,
  style,
  ...rest
}: SVGProps<SVGTextElement> & { children?: ReactNode; style?: CSSProperties }) {
  return (
    <text style={style} {...rest}>
      {children}
    </text>
  );
}
