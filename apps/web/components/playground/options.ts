import type { RenderOptions } from "takumi-pdf";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type PlaygroundPdfOptions = DistributiveOmit<
  RenderOptions,
  "fonts" | "images" | "stylesheets" | "fontFamilies"
>;

declare global {
  interface PlaygroundOptions {
    width?: number;
    height?: number;
    format?: "png" | "jpeg" | "webp";
    quality?: number;
    devicePixelRatio?: number;
    stylesheets?: string[];
    pdf?: PlaygroundPdfOptions;
  }
}
