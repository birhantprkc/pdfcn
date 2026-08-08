import type { ReactNode, ImgHTMLAttributes, AnchorHTMLAttributes } from "react";

export type Style = Record<string, unknown>;

export const StyleSheet = {
  create<T extends Record<string, Style>>(styles: T): T {
    return styles;
  },
};

type StyleInput = Style | Style[] | false | null | undefined;

interface ViewProps {
  children?: ReactNode;
  style?: StyleInput;
  className?: string;
  wrap?: boolean;
  fixed?: boolean;
  break?: boolean;
  minPresenceAhead?: number;
}

const flatten = (style?: StyleInput): Record<string, unknown> | undefined => {
  if (!style) {
    return undefined;
  }
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.filter(Boolean));
  }
  return style;
};

export const View = ({ children, style, className, ...rest }: ViewProps) => {
  const {
    wrap: _w,
    fixed: _f,
    break: br,
    minPresenceAhead: _m,
    ...dom
  } = rest as ViewProps & Record<string, unknown>;
  const merged = flatten(style) ?? {};
  if (br) {
    Object.assign(merged, { breakBefore: "page" });
  }
  return (
    <div
      className={className}
      style={merged as React.CSSProperties}
      {...(dom as object)}
    >
      {children}
    </div>
  );
};

interface TextProps {
  children?: ReactNode;
  style?: StyleInput;
  className?: string;
  render?: (info: { pageNumber: number; totalPages: number }) => ReactNode;
  fixed?: boolean;
  href?: string;
  src?: string;
}

export const Text = ({
  children,
  style,
  className,
  render: _render,
  href,
  src,
  ...rest
}: TextProps) => {
  const merged = flatten(style) as React.CSSProperties | undefined;
  const link = href ?? src;
  if (link) {
    return (
      <a href={link} className={className} style={merged} {...(rest as object)}>
        {children}
      </a>
    );
  }
  return (
    <span className={className} style={merged} {...(rest as object)}>
      {children}
    </span>
  );
};

export const Image = ({
  src,
  style,
  ...rest
}: {
  src: string | { uri: string };
  style?: StyleInput;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "style">) => {
  const resolved = typeof src === "string" ? src : src.uri;
  return (
    <img
      src={resolved}
      style={flatten(style) as React.CSSProperties}
      alt=""
      {...rest}
    />
  );
};

export const Link = ({
  src,
  children,
  style,
  ...rest
}: {
  src: string;
  children?: ReactNode;
  style?: StyleInput;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "style">) => (
  <a href={src} style={flatten(style) as React.CSSProperties} {...rest}>
    {children}
  </a>
);

export const Document = ({
  children,
  title,
  style,
}: {
  children?: ReactNode;
  title?: string;
  style?: StyleInput;
}) => (
  <div data-pdf-document={title} style={flatten(style) as React.CSSProperties}>
    {children}
  </div>
);

export const Page = ({
  children,
  size: _size,
  style,
}: {
  children?: ReactNode;
  size?: string | { width: number; height: number };
  style?: StyleInput;
}) => (
  <div data-pdf-page style={flatten(style) as React.CSSProperties}>
    {children}
  </div>
);
