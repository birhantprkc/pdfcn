"use client";

import { useEffect, useRef, useState } from "react";
import type { z } from "zod/mini";

import { messageSchema } from "./schema";
import type { RenderMessageInput, renderResultSchema } from "./schema";

export type RenderResult = z.infer<typeof renderResultSchema>["result"];
export type RenderSuccess = Extract<RenderResult, { status: "success" }> & {
  outputSize: number;
};
export type RenderError = Extract<RenderResult, { status: "error" }>;

const isBlobUrl = (url: string | undefined): url is string =>
  typeof url === "string" && url.startsWith("blob:");

const mimeType = (result: RenderResult & { status: "success" }) =>
  result.outputKind === "pdf"
    ? "application/pdf"
    : `image/${result.outputFormat}`;

export const useRenderWorker = (ranCode: string | undefined) => {
  const [isReady, setIsReady] = useState(false);
  const [lastSuccess, setLastSuccess] = useState<RenderSuccess>();
  const [renderError, setRenderError] = useState<RenderError>();
  const currentRequestIdRef = useRef(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("worker.ts", import.meta.url), {
      type: "module",
    });

    // eslint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener) -- Worker message handler
    worker.onmessage = (event: MessageEvent) => {
      const message = messageSchema.parse(event.data);

      switch (message.type) {
        case "ready": {
          setIsReady(true);
          break;
        }
        case "render-request": {
          throw new Error("request is not possible for response");
        }
        case "preview-result": {
          break;
        }
        case "render-result": {
          const { result } = message;
          if (result.id !== currentRequestIdRef.current) {
            break;
          }

          if (result.status === "success") {
            const blob = new Blob([result.outputBuffer as BlobPart], {
              type: mimeType(result),
            });
            setLastSuccess({
              ...result,
              outputSize: blob.size,
              outputUrl: URL.createObjectURL(blob),
            });
            setRenderError(undefined);
          } else {
            setRenderError(result);
          }
          break;
        }
        default: {
          message satisfies never;
        }
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
      setIsReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isReady || ranCode === undefined) {
      return;
    }

    const requestId = currentRequestIdRef.current + 1;
    currentRequestIdRef.current = requestId;
    workerRef.current?.postMessage({
      code: ranCode,
      id: requestId,
      type: "render-request",
    } satisfies RenderMessageInput);
  }, [isReady, ranCode]);

  useEffect(() => {
    if (!isBlobUrl(lastSuccess?.outputUrl)) {
      return;
    }
    const url = lastSuccess.outputUrl;
    return () => URL.revokeObjectURL(url);
  }, [lastSuccess]);

  return { isReady, lastSuccess, renderError };
};
