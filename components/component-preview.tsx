import type { ReactNode } from "react";

import { ComponentSource } from "@/components/component-source";
import { PdfPreview } from "@/components/pdf-preview-wrapper";
import { cn } from "@/lib/utils";
import { DEFAULT_BASE } from "@/registry/bases";
import type { BaseName } from "@/registry/bases";
import type { PdfcnTheme } from "@/registry/themes";

export const ComponentPreview = ({
  base = DEFAULT_BASE,
  name,
  src,
  title,
  theme,
  children,
  className,
  hideCode = false,
}: {
  base?: BaseName;
  name?: string;
  src?: string;
  title?: string;
  theme?: PdfcnTheme;
  children?: ReactNode;
  className?: string;
  hideCode?: boolean;
}) => (
  <>
    {children}
    {name ? (
      <PdfPreview
        base={base}
        name={name}
        theme={theme}
        className={cn("mt-4", className)}
      />
    ) : null}
    {hideCode ? null : (
      <ComponentSource base={base} name={name} src={src} title={title} />
    )}
  </>
);
