import type { CSSProperties, ReactNode, SVGProps } from "react";

export const Svg = ({
  children,
  style,
  ...rest
}: SVGProps<SVGSVGElement> & { style?: CSSProperties }) => (
  <svg style={style} {...rest}>
    {children}
  </svg>
);

export const Rect = (props: SVGProps<SVGRectElement>) => <rect {...props} />;
export const Circle = (props: SVGProps<SVGCircleElement>) => (
  <circle {...props} />
);
export const G = (props: SVGProps<SVGGElement>) => <g {...props} />;
export const Line = (props: SVGProps<SVGLineElement>) => <line {...props} />;
export const Path = (props: SVGProps<SVGPathElement>) => <path {...props} />;
export const SvgText = ({
  children,
  style,
  ...rest
}: SVGProps<SVGTextElement> & {
  children?: ReactNode;
  style?: CSSProperties;
}) => (
  <text style={style} {...rest}>
    {children}
  </text>
);
