import * as React from "react";
import { transform } from "sucrase";
import * as z from "zod/mini";

import { optionsSchema } from "./schema";

const exportsSchema = z.object({
  default: z.function(),
  options: optionsSchema,
});

const transformCode = (code: string) =>
  transform(code, {
    production: true,
    transforms: ["jsx", "typescript", "imports"],
  }).code;

export const evaluateCodeExports = (code: string, react: typeof React) => {
  const exports: Record<string, unknown> = {};
  // eslint-disable-next-line eslint(no-new-func) -- Required for sandboxed code evaluation
  new Function("exports", "React", transformCode(code))(exports, react);
  return exportsSchema.parse(exports);
};

const mirrorTw = <P>(props: P): P => {
  if (!props || typeof props !== "object" || !("tw" in props)) {
    return props;
  }
  const { tw, className, class: klass } = props as Record<string, unknown>;
  return {
    ...props,
    className: [className ?? klass, tw].filter(Boolean).join(" "),
  };
};

export const renderReact: typeof React = {
  ...React,
  createElement: ((
    type: React.ElementType,
    props: Record<string, unknown> | null,
    ...children: React.ReactNode[]
  ) =>
    React.createElement(
      type,
      mirrorTw(props),
      ...children
    )) as typeof React.createElement,
};
