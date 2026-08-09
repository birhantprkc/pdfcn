import type { ReactNode } from "react";

import { ComponentSource } from "@/components/component-source";
import { PdfPreview } from "@/components/pdf-preview-wrapper";
import { cn } from "@/lib/utils";
import { DEFAULT_BASE } from "@/registry/bases";
import type { BaseName } from "@/registry/bases";

export const ComponentPreview = ({
  base = DEFAULT_BASE,
  name,
  src,
  title,
  children,
  className,
  hideCode = false,
}: {
  base?: BaseName;
  name?: string;
  src?: string;
  title?: string;
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
        className={cn("mt-4", className)}
      />
    ) : null}
    {!hideCode ? (
      <ComponentSource base={base} name={name} src={src} title={title} />
    ) : null}
  </>
);
