"use client";

import {
  ArrowUpRightIcon,
  CodeXmlIcon,
  EyeIcon,
  FileIcon,
  MonitorIcon,
  SmartphoneIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createElement, useEffect, useState } from "react";

import { CodeBlockCommand } from "@/components/code-block-command";
import { CopyButton } from "@/components/copy-button";
import {
  getHomePdfSource,
  homePdfBases,
  homePdfCodeOutputs,
  homePdfComponentCatalog,
  homePdfPreviews,
} from "@/components/home-pdf-preview";
import type {
  CodeOutput,
  ComponentPartId,
  HomePdfBase,
  PdfRecipe,
  PdfRecipeId,
} from "@/components/home-pdf-preview";
import { FormeIcon, TakumiIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import type { BaseName } from "@/registry/bases";

const PdfPreview = dynamic(
  async () => {
    const mod = await import("@/components/pdf-preview");
    return mod.PdfPreview;
  },
  { ssr: false }
);

type PreviewViewport = "desktop" | "mobile";
type WorkspaceTab = "preview" | "code";

interface HomePdfCodeOutput {
  code: string;
  highlightedCode: string;
}

interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modDate?: string;
  keywords?: string;
}

const codeCache = new Map<string, HomePdfCodeOutput>();
const metadataCache = new Map<string, PdfMetadata>();
const homePdfBaseIcons: Record<HomePdfBase, typeof TakumiIcon> = {
  forme: FormeIcon,
  takumi: TakumiIcon,
};

const PdfBaseIcon = ({
  base,
  className,
}: {
  base: HomePdfBase;
  className?: string;
}) => {
  const Icon = homePdfBaseIcons[base];
  return <Icon className={className} aria-hidden="true" />;
};

const MetadataViewer = ({ metadata }: { metadata: PdfMetadata | null }) => {
  if (!metadata) {
    return (
      <div className="flex h-full min-h-72 items-center justify-center text-sm text-muted-foreground">
        No metadata available
      </div>
    );
  }

  const entries = Object.entries(metadata).filter(
    ([, value]) => value !== undefined && value !== ""
  );

  if (entries.length === 0) {
    return (
      <div className="flex h-full min-h-72 items-center justify-center text-sm text-muted-foreground">
        No metadata found in this document
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mx-auto max-w-lg space-y-3">
        {entries.map(([key, value]) => (
          <div key={key} className="rounded-lg border bg-card p-3">
            <dt className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {key.replaceAll(/([A-Z])/g, " $1").trim()}
            </dt>
            <dd className="mt-1 text-sm">{value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
};

const CodeViewer = ({
  availableOutputs,
  error,
  isLoading,
  output,
  selectedOutput,
  metadata,
  onOutputChange,
}: {
  availableOutputs: { id: CodeOutput; label: string }[];
  error: string | null;
  isLoading: boolean;
  output: CodeOutput;
  selectedOutput: HomePdfCodeOutput | null;
  metadata: PdfMetadata | null;
  onOutputChange: (output: CodeOutput) => void;
}) => (
  <div className="flex h-full min-h-[560px] flex-col bg-code text-code-foreground lg:min-h-0">
    <div className="flex h-12 shrink-0 items-center px-4">
      <Tabs
        value={output}
        onValueChange={(value) => onOutputChange(value as CodeOutput)}
        className="gap-0"
      >
        <TabsList className="bg-background/8 p-0.5">
          {availableOutputs.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              sound="toggleOn"
              className="h-8 px-3"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {output === "react" ? (
        <CopyButton
          className="static ml-auto bg-transparent"
          value={selectedOutput?.code ?? ""}
          event="copy_block_code"
        />
      ) : null}
    </div>
    <Separator className="bg-border/50" />

    {output === "metadata" ? (
      <MetadataViewer metadata={metadata} />
    ) : (
      <div className="no-scrollbar min-h-0 flex-1 overflow-auto">
        {isLoading ? (
          <div
            className="flex h-full min-h-72 items-center justify-center text-sm text-code-foreground/60"
            role="status"
          >
            Rendering source…
          </div>
        ) : null}
        {error ? (
          <div
            className="flex h-full min-h-72 items-center justify-center px-6 text-center text-sm text-red-400"
            role="alert"
          >
            {error}
          </div>
        ) : null}
        {selectedOutput && !isLoading ? (
          <figure
            data-rehype-pretty-code-figure=""
            className="!m-0 min-h-full !rounded-none text-sm [&>div]:min-h-full [&_pre]:min-h-full"
          >
            <div
              // Shiki returns trusted HTML generated from the provided source code.
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: selectedOutput.highlightedCode,
              }}
            />
          </figure>
        ) : null}
      </div>
    )}
  </div>
);

const findPdf = (id: PdfRecipeId): PdfRecipe =>
  homePdfPreviews.find((pdf) => pdf.id === id) ?? homePdfPreviews[0];

const extractMetadata = async (base: BaseName, name: string) => {
  const cacheKey = `${base}:${name}`;
  const cached = metadataCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  let pdfBytes: Uint8Array;

  if (base === "takumi") {
    const [{ demos }, { default: initialize, render }, { fromJsx }] =
      await Promise.all([
        import("@/examples/__takumi__"),
        import("takumi-pdf"),
        import("@takumi-rs/helpers/jsx"),
      ]);
    const Demo = demos[name];
    if (!Demo) {
      throw new Error(`Unknown Takumi demo: ${name}`);
    }

    await initialize({ module_or_path: "/takumi_pdf_wasm_bg.wasm" });
    const { node, stylesheets } = await fromJsx(createElement(Demo));
    const buffer = await render(node, {
      margin: { bottom: 0, left: 0, right: 0, top: 0 },
      size: "a4",
      stylesheets,
    });
    pdfBytes = new Uint8Array(buffer);
  } else {
    const [{ demos }, { renderSerializedDoc }, { serialize }] =
      await Promise.all([
        import("@/examples/__forme__"),
        import("@formepdf/core/browser"),
        import("@formepdf/react"),
      ]);
    const Demo = demos[name];
    if (!Demo) {
      throw new Error(`Unknown Forme demo: ${name}`);
    }

    const document = serialize(createElement(Demo));
    const buffer = await renderSerializedDoc(
      document as unknown as Record<string, unknown>
    );
    pdfBytes = new Uint8Array(buffer);
  }

  const { getDocument } = await import("pdfjs-dist");
  const loadingTask = getDocument({ data: pdfBytes });
  const pdfDoc = await loadingTask.promise;
  const metadataResult = await pdfDoc.getMetadata();

  const info = metadataResult.info as Record<string, string>;
  const metadata: PdfMetadata = {
    author: info.Author || undefined,
    creationDate: info.CreationDate || undefined,
    creator: info.Creator || undefined,
    keywords: info.Keywords || undefined,
    modDate: info.ModDate || undefined,
    producer: info.Producer || undefined,
    subject: info.Subject || undefined,
    title: info.Title || undefined,
  };

  metadataCache.set(cacheKey, metadata);
  return metadata;
};

export const HomePdfShowcase = () => {
  const [selectedPdfId, setSelectedPdfId] =
    useState<PdfRecipeId>("corporate-invoice");
  const [selectedComponentId, setSelectedComponentId] =
    useState<ComponentPartId>("page-header");
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("preview");
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [codeOutput, setCodeOutput] = useState<CodeOutput>("react");
  const [pdfBase, setPdfBase] = useState<HomePdfBase>("forme");
  const [codeRequest, setCodeRequest] = useState<{
    data: HomePdfCodeOutput | null;
    error: string | null;
    isLoading: boolean;
    key: string;
  }>({
    data: null,
    error: null,
    isLoading: false,
    key: "",
  });
  const [pdfMetadata, setPdfMetadata] = useState<PdfMetadata | null>(null);
  const [_metadataLoading, setMetadataLoading] = useState(false);

  const selectedPdf = findPdf(selectedPdfId);
  const selectedComponent = homePdfComponentCatalog[selectedComponentId];
  const registryItem = `@pdfcn/${pdfBase}/${selectedComponentId}`;
  const codeRequestKey = `${pdfBase}:${selectedPdf.id}:react`;
  const selectedCodeOutput =
    codeRequest.key === codeRequestKey ? codeRequest.data : null;

  useEffect(() => {
    if (workspaceTab !== "code" || codeOutput !== "react") {
      return;
    }

    const cached = codeCache.get(codeRequestKey);
    if (cached) {
      setCodeRequest({
        data: cached,
        error: null,
        isLoading: false,
        key: codeRequestKey,
      });
      return;
    }

    let cancelled = false;
    const loadCode = async () => {
      setCodeRequest({
        data: null,
        error: null,
        isLoading: true,
        key: codeRequestKey,
      });

      try {
        const code = getHomePdfSource(selectedPdf, pdfBase);
        const { highlightCode } = await import("@/lib/highlight-code");
        const output = {
          code,
          highlightedCode: await highlightCode(code, "tsx"),
        };
        codeCache.set(codeRequestKey, output);

        if (cancelled) {
          return;
        }

        setCodeRequest({
          data: output,
          error: null,
          isLoading: false,
          key: codeRequestKey,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }
        setCodeRequest({
          data: null,
          error:
            error instanceof Error
              ? error.message
              : "Could not render this source.",
          isLoading: false,
          key: codeRequestKey,
        });
      }
    };

    void loadCode();
    return () => {
      cancelled = true;
    };
  }, [codeOutput, codeRequestKey, pdfBase, selectedPdf, workspaceTab]);

  useEffect(() => {
    if (workspaceTab !== "code" || codeOutput !== "metadata") {
      return;
    }

    const metadataKey = `${pdfBase}:${selectedPdf.id}`;
    const cached = metadataCache.get(metadataKey);
    if (cached) {
      setPdfMetadata(cached);
      return;
    }

    let cancelled = false;
    const loadMetadata = async () => {
      setMetadataLoading(true);
      try {
        const metadata = await extractMetadata(pdfBase, selectedPdf.id);
        if (!cancelled) {
          setPdfMetadata(metadata);
        }
      } catch {
        if (!cancelled) {
          setPdfMetadata(null);
        }
      } finally {
        if (!cancelled) {
          setMetadataLoading(false);
        }
      }
    };

    void loadMetadata();
    return () => {
      cancelled = true;
    };
  }, [codeOutput, pdfBase, selectedPdf, workspaceTab]);

  const handlePdfBaseChange = (base: HomePdfBase) => {
    setPdfBase(base);
    setPdfMetadata(null);
  };

  const handlePdfChange = (pdfId: PdfRecipeId) => {
    const nextPdf = findPdf(pdfId);
    setSelectedPdfId(pdfId);
    setSelectedComponentId(nextPdf.defaultComponentId);
    setPdfMetadata(null);
  };

  const handleComponentChange = (componentId: ComponentPartId) => {
    setSelectedComponentId(componentId);
    setWorkspaceTab("preview");
  };

  return (
    <section className="container-wrapper pb-12 md:pb-16 lg:pb-24">
      <div className="container">
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="block px-0">
            <div className="grid min-h-12 grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-2 px-3 lg:gap-3 lg:px-4">
              <div
                className="col-start-1 row-start-1 hidden justify-self-start gap-1.5 lg:flex"
                aria-hidden="true"
              >
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
              </div>
              <h2
                className="col-start-2 row-start-1 flex min-w-0 max-w-[70vw] items-center justify-self-center gap-2 px-2 text-sm font-medium text-muted-foreground lg:max-w-full"
                title={selectedPdf.filename}
              >
                <FileIcon className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{selectedPdf.filename}</span>
              </h2>

              <div
                className="col-start-3 row-start-1 hidden justify-self-end rounded-lg bg-muted p-0.5 lg:flex"
                role="radiogroup"
                aria-label="PDF base"
              >
                {homePdfBases.map((base) => (
                  <Toggle
                    key={base.id}
                    size="sm"
                    pressed={pdfBase === base.id}
                    onPressedChange={() => handlePdfBaseChange(base.id)}
                    aria-label={base.label}
                    className="h-7 gap-1.5 border border-transparent px-2 text-xs data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=on]:hover:bg-background data-[state=on]:hover:text-foreground dark:data-[state=on]:border-input dark:data-[state=on]:bg-input/30 dark:data-[state=on]:hover:bg-input/30"
                  >
                    <PdfBaseIcon base={base.id} className="size-3.5" />
                    {base.label}
                  </Toggle>
                ))}
              </div>
            </div>

            <Separator className="lg:hidden" />

            <div className="flex h-12 items-center justify-between gap-3 px-3 lg:hidden">
              <label
                htmlFor="home-pdf-base"
                className="text-sm font-medium text-muted-foreground"
              >
                Choose base
              </label>
              <NativeSelect
                id="home-pdf-base"
                size="sm"
                value={pdfBase}
                onChange={(e) =>
                  handlePdfBaseChange(e.target.value as HomePdfBase)
                }
                className="w-40 min-w-0 sm:w-48"
              >
                {homePdfBases.map((base) => (
                  <NativeSelectOption key={base.id} value={base.id}>
                    {base.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0 lg:grid lg:h-[720px] lg:grid-cols-[14rem_minmax(0,1fr)_20rem]">
            <aside
              aria-label="PDF examples"
              className="hidden flex-col bg-card lg:flex lg:border-r"
            >
              <div className="flex h-12 shrink-0 items-center px-4">
                <CardTitle className="text-sm">Documents</CardTitle>
              </div>
              <Separator />

              <div className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto p-2">
                {homePdfPreviews.map((pdf) => {
                  const isSelected = selectedPdfId === pdf.id;

                  return (
                    <Button
                      key={pdf.id}
                      type="button"
                      variant="ghost"
                      size="sm"
                      sound="click"
                      aria-pressed={isSelected}
                      className={cn(
                        "h-9 justify-start border px-2 text-left",
                        isSelected
                          ? "border-border bg-muted text-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted"
                          : "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                      onClick={() => handlePdfChange(pdf.id)}
                    >
                      <span className="truncate">{pdf.name}</span>
                    </Button>
                  );
                })}
              </div>
            </aside>

            <Tabs
              value={workspaceTab}
              onValueChange={(value) => setWorkspaceTab(value as WorkspaceTab)}
              className="min-w-0 gap-0 bg-muted/55 lg:h-full"
            >
              <div className="flex h-12 shrink-0 items-center justify-between gap-3 bg-card px-3 lg:hidden">
                <label
                  htmlFor="home-pdf-template"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Choose template
                </label>
                <NativeSelect
                  id="home-pdf-template"
                  size="sm"
                  value={selectedPdfId}
                  onChange={(e) =>
                    handlePdfChange(e.target.value as PdfRecipeId)
                  }
                  className="w-40 min-w-0 sm:w-48"
                >
                  {homePdfPreviews.map((pdf) => (
                    <NativeSelectOption key={pdf.id} value={pdf.id}>
                      {pdf.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <Separator className="lg:hidden" />

              <div className="flex h-12 shrink-0 items-center justify-between gap-2 bg-card px-4">
                <TabsList className="h-8 p-0.5">
                  <TabsTrigger
                    value="preview"
                    sound="toggleOn"
                    className="h-7 px-2.5 text-xs"
                  >
                    <EyeIcon className="size-3.5" aria-hidden="true" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    sound="toggleOn"
                    className="h-7 px-2.5 text-xs"
                  >
                    <CodeXmlIcon className="size-3.5" aria-hidden="true" />
                    Code
                  </TabsTrigger>
                </TabsList>

                {workspaceTab === "preview" ? (
                  <div
                    className="hidden rounded-lg bg-muted p-0.5 lg:flex"
                    role="radiogroup"
                    aria-label="PDF preview viewport"
                  >
                    <Toggle
                      size="sm"
                      pressed={viewport === "desktop"}
                      onPressedChange={() => setViewport("desktop")}
                      aria-label="Desktop preview"
                      className="h-7 gap-1.5 px-2.5 text-xs"
                    >
                      <MonitorIcon className="size-3.5" aria-hidden="true" />
                      <span className="hidden xl:inline">Desktop</span>
                    </Toggle>
                    <Toggle
                      size="sm"
                      pressed={viewport === "mobile"}
                      onPressedChange={() => setViewport("mobile")}
                      aria-label="Mobile preview"
                      className="h-7 gap-1.5 px-2.5 text-xs"
                    >
                      <SmartphoneIcon className="size-3.5" aria-hidden="true" />
                      <span className="hidden xl:inline">Mobile</span>
                    </Toggle>
                  </div>
                ) : null}
              </div>

              <Separator />

              <TabsContent value="preview" className="min-h-0">
                <div className="h-[520px] overflow-auto p-2 sm:h-[620px] sm:p-4 lg:h-[672px] lg:p-5">
                  <div
                    className={cn(
                      "mx-auto w-full max-w-[375px] transition-[width] duration-200",
                      viewport === "desktop"
                        ? "lg:w-[600px] lg:max-w-full"
                        : "lg:w-[375px]"
                    )}
                  >
                    <PdfPreview
                      base={pdfBase}
                      name={selectedPdf.id}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="min-h-0">
                <CodeViewer
                  availableOutputs={homePdfCodeOutputs}
                  error={
                    codeRequest.key === codeRequestKey
                      ? codeRequest.error
                      : null
                  }
                  isLoading={
                    codeRequest.key === codeRequestKey && codeRequest.isLoading
                  }
                  output={codeOutput}
                  selectedOutput={selectedCodeOutput}
                  metadata={pdfMetadata}
                  onOutputChange={setCodeOutput}
                />
              </TabsContent>
            </Tabs>

            <aside
              aria-label="Components used in the selected document"
              className="no-scrollbar border-t bg-card lg:overflow-y-auto lg:border-t-0 lg:border-l"
            >
              <div className="flex h-12 shrink-0 items-center justify-between gap-3 px-4">
                <CardTitle className="text-sm">Components Used</CardTitle>
                <Badge
                  variant="outline"
                  className="font-mono text-muted-foreground"
                >
                  {selectedPdf.componentIds.length}
                </Badge>
              </div>
              <Separator />

              <CardContent className="p-2">
                <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
                  {selectedPdf.componentIds.map((componentId, index) => {
                    const part = homePdfComponentCatalog[componentId];
                    const isSelected = selectedComponentId === componentId;

                    return (
                      <Button
                        key={componentId}
                        type="button"
                        variant="ghost"
                        size="sm"
                        sound="click"
                        aria-pressed={isSelected}
                        className={cn(
                          "h-9 min-w-48 justify-start gap-2.5 border px-2 text-left lg:min-w-0",
                          isSelected
                            ? "border-blue-500/40 bg-blue-500/10 text-blue-700 hover:bg-blue-500/10 hover:text-blue-700 dark:text-blue-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                            : "border-transparent text-muted-foreground hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                        )}
                        onClick={() => handleComponentChange(componentId)}
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "size-6 bg-background px-0 font-mono",
                            isSelected && "border-blue-500/40 text-blue-600"
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </Badge>
                        <span className="min-w-0 flex-1 truncate font-medium">
                          {part.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>

              <Separator />

              <CardContent className="p-4" aria-live="polite">
                <h3 className="text-lg font-semibold tracking-tight">
                  <Link
                    href={`/docs/components/${selectedComponent.docsPath}`}
                    className="group inline-flex items-center gap-1.5 rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    transitionTypes={["nav-forward"]}
                  >
                    {selectedComponent.label}
                    <ArrowUpRightIcon
                      className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {selectedComponent.description}
                </p>

                <CodeBlockCommand
                  __bun__={`bunx --bun shadcn@latest add ${registryItem}`}
                  __npm__={`npx shadcn@latest add ${registryItem}`}
                  __pnpm__={`pnpm dlx shadcn@latest add ${registryItem}`}
                  __yarn__={`yarn shadcn@latest add ${registryItem}`}
                  className="mt-4 border border-border/70 dark:bg-background/60"
                />
              </CardContent>
            </aside>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
