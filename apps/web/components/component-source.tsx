import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { ComponentCode } from "@/components/component-code";
import { formatCode } from "@/lib/format-code";
import { highlightCode } from "@/lib/highlight-code";
import {
  getDemoSource,
  getRegistrySource,
  readOptionalFromRoot,
} from "@/lib/registry";
import { cn } from "@/lib/utils";
import type { BaseName } from "@/registry/bases";

export const ComponentSource = async ({
  base = "takumi",
  name,
  src,
  title,
  collapsible = true,
  className,
  language,
}: {
  base?: BaseName;
  name?: string;
  src?: string;
  title?: string;
  collapsible?: boolean;
  className?: string;
  language?: string;
}) => {
  let code: string | null = null;

  if (name) {
    code =
      (await getDemoSource(name, base)) ??
      (await getRegistrySource(name, base));
  }

  if (src) {
    code = await readOptionalFromRoot(src);
  }

  if (!code) {
    return null;
  }

  code = await formatCode(code);

  const lang = language ?? title?.split(".").pop() ?? "tsx";
  const highlightedCode = await highlightCode(code, lang);

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          title={title}
        />
      </div>
    );
  }

  return (
    <CodeCollapsibleWrapper
      className={className}
      navTriggerClassName={cn(!title && "top-3")}
    >
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
      />
    </CodeCollapsibleWrapper>
  );
};
