import * as z from "zod/mini";

import type { PdfInspection } from "./inspect-pdf";

export const optionsSchema = z.object({
  devicePixelRatio: z.optional(
    z.number().check(z.positive(), z.minimum(0.1), z.maximum(10))
  ),
  format: z.optional(z.enum(["png", "jpeg", "webp"])),
  height: z.optional(z.int().check(z.positive(), z.minimum(1))),
  pdf: z.optional(z.custom<Record<string, unknown>>()),
  quality: z.optional(
    z.int().check(z.positive(), z.minimum(1), z.maximum(100))
  ),
  stylesheets: z.optional(z.array(z.string())),
  width: z.optional(z.int().check(z.positive(), z.minimum(1))),
});

export const outputKinds = ["image", "pdf"] as const;

export type OutputKind = (typeof outputKinds)[number];

const renderSuccessSchema = z.object({
  duration: z.number(),
  id: z.int().check(z.positive(), z.minimum(1)),
  inspection: z.optional(z.custom<PdfInspection>()),
  label: z.string(),
  outputBuffer: z.any(),
  outputFormat: z.string(),
  outputKind: z.enum(outputKinds),
  outputUrl: z.optional(z.string()),
  status: z.literal("success"),
});

const renderErrorSchema = z.object({
  id: z.int().check(z.positive(), z.minimum(1)),
  message: z.string(),
  status: z.literal("error"),
});

const renderRequestSchema = z.object({
  code: z.string(),
  id: z.int().check(z.positive(), z.minimum(1)),
  type: z.literal("render-request"),
});

export const renderResultSchema = z.object({
  result: z.discriminatedUnion("status", [
    renderSuccessSchema,
    renderErrorSchema,
  ]),
  type: z.literal("render-result"),
});

const readySchema = z.object({
  type: z.literal("ready"),
});

export const messageSchema = z.discriminatedUnion("type", [
  renderRequestSchema,
  renderResultSchema,
  readySchema,
]);

export type RenderMessageInput = z.input<typeof messageSchema>;
