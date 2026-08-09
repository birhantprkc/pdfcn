import * as z from "zod/mini";
import type { PdfInspection } from "./inspect-pdf";

export const optionsSchema = z.object({
  width: z.optional(z.int().check(z.positive(), z.minimum(1))),
  height: z.optional(z.int().check(z.positive(), z.minimum(1))),
  quality: z.optional(z.int().check(z.positive(), z.minimum(1), z.maximum(100))),
  format: z.optional(z.enum(["png", "jpeg", "webp"])),
  devicePixelRatio: z.optional(z.number().check(z.positive(), z.minimum(0.1), z.maximum(10.0))),
  stylesheets: z.optional(z.array(z.string())),
  pdf: z.optional(z.custom<Record<string, unknown>>()),
});

export const outputKinds = ["image", "pdf"] as const;

export type OutputKind = (typeof outputKinds)[number];

const renderSuccessSchema = z.object({
  status: z.literal("success"),
  id: z.int().check(z.positive(), z.minimum(1)),
  outputBuffer: z.any(),
  outputUrl: z.optional(z.string()),
  duration: z.number(),
  outputKind: z.enum(outputKinds),
  outputFormat: z.string(),
  label: z.string(),
  inspection: z.optional(z.custom<PdfInspection>()),
});

const renderErrorSchema = z.object({
  status: z.literal("error"),
  id: z.int().check(z.positive(), z.minimum(1)),
  message: z.string(),
});

const renderRequestSchema = z.object({
  type: z.literal("render-request"),
  id: z.int().check(z.positive(), z.minimum(1)),
  code: z.string(),
});

export const renderResultSchema = z.object({
  type: z.literal("render-result"),
  result: z.discriminatedUnion("status", [renderSuccessSchema, renderErrorSchema]),
});

const readySchema = z.object({
  type: z.literal("ready"),
});

const previewResultSchema = z.object({
  type: z.literal("preview-result"),
  id: z.int().check(z.positive(), z.minimum(1)),
  html: z.string(),
  width: z.optional(z.int().check(z.positive(), z.minimum(1))),
  height: z.optional(z.int().check(z.positive(), z.minimum(1))),
  padding: z.optional(z.string()),
  cssContents: z.optional(z.array(z.string())),
});

export const messageSchema = z.discriminatedUnion("type", [
  renderRequestSchema,
  renderResultSchema,
  readySchema,
  previewResultSchema,
]);

export type RenderMessageInput = z.input<typeof messageSchema>;
