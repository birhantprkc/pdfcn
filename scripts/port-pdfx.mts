/**
 * Ports pdfx registry sources into pdfcn takumi + forme bases.
 * Run: pnpm exec tsx scripts/port-pdfx.mts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, ".pdfx-ref/apps/www/src/registry");
const SHARED = path.join(ROOT, ".pdfx-ref/packages/shared/src");

const ensureDir = (dir: string) => {
  fs.mkdirSync(dir, { recursive: true });
};

const write = (file: string, content: string) => {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf-8");
};

const read = (file: string) => fs.readFileSync(file, "utf-8");

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (!entry.name.includes(".test.")) {
      out.push(full);
    }
  }
  return out;
};

const renameShared = (content: string) =>
  content
    .replaceAll("PdfxTheme", "PdfcnTheme")
    .replaceAll("PDFx", "pdfcn")
    .replaceAll("@pdfx/shared", "@/registry/themes")
    .replaceAll("../theme.js", "./theme-types")
    .replaceAll("./theme.js", "./theme-types")
    .replaceAll("./themes/index.js", "./index")
    .replaceAll("./primitives.js", "./primitives")
    .replaceAll("./professional.js", "./professional")
    .replaceAll("./modern.js", "./modern")
    .replaceAll("./minimal.js", "./minimal")
    .replaceAll("./executive.js", "./executive")
    .replaceAll("./corporate.js", "./corporate")
    .replaceAll("./elegant.js", "./elegant")
    .replaceAll("./vivid.js", "./vivid")
    .replaceAll("./forest.js", "./forest")
    .replaceAll("./blueprint.js", "./blueprint")
    .replaceAll("from './types.js'", "from './component-types'")
    .replaceAll('from "./types.js"', 'from "./component-types"');

const transformCommon = (content: string) =>
  content
    .replaceAll("@pdfx/shared", "@/registry/themes")
    .replaceAll("PdfxTheme", "PdfcnTheme")
    .replaceAll("usePdfxTheme", "usePdfcnTheme")
    .replaceAll("PdfxThemeProvider", "PdfcnThemeProvider")
    .replaceAll("PdfxThemeContext", "PdfcnThemeContext")
    .replaceAll("pdfx-theme-context", "pdfcn-theme-context")
    .replaceAll("pdfx-theme", "pdfcn-theme")
    .replaceAll("@pdfx/components", "@/registry/bases/PLACEHOLDER/components")
    .replaceAll(
      /from ['"]\.\.\/\.\.\/lib\/resolve-color\.js['"]/g,
      'from "../../lib/resolve-color"'
    )
    .replaceAll(/from ['"]\.\/pdfx-theme['"]/g, 'from "./pdfcn-theme"')
    .replaceAll(
      /from ['"]\.\/pdfx-theme-context['"]/g,
      'from "./pdfcn-theme-context"'
    );

const transformForme = (content: string) => {
  let out = transformCommon(content);
  out = out.replaceAll(
    "@/registry/bases/PLACEHOLDER/components",
    "@/registry/bases/forme/components"
  );

  // Imports from @react-pdf/renderer → @formepdf/react
  out = out.replaceAll(
    /import\s+\{([^}]+)\}\s+from\s+['"]@react-pdf\/renderer['"];?/g,
    (_m, imports: string) => {
      let list = imports
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Map react-pdf SVG primitives — Forme Svg accepts JSX children for basic shapes
      // Keep Svg; drop Circle/G/Line/Path/Rect/Text-as-SvgText and import from react for HTML-in-Svg if needed
      // Forme supports Svg with children path/rect/circle — keep as-is where possible
      const rename: Record<string, string> = {
        "Text as PDFText": "Text as PDFText",
        "Text as SvgText": "Text as SvgText",
      };
      list = list.map((item) => rename[item] ?? item);

      // Document/Page stay; StyleSheet stays; View/Text/Image/Link stay
      // `break` prop on View → use PageBreak component (handled in source transforms below)
      return `import { ${list.join(", ")} } from "@formepdf/react";`;
    }
  );

  out = out.replaceAll(
    /import\s+type\s+\{([^}]+)\}\s+from\s+['"]@react-pdf\/types['"];?/g,
    'import type { Style } from "@formepdf/react";'
  );

  // PageBreak: <View break .../> → <PageBreak />
  if (out.includes("break") && out.includes("PageBreak")) {
    out = out.replace(
      /import\s+\{\s*View\s*\}\s+from\s+["']@formepdf\/react["'];/,
      'import { PageBreak as FormePageBreak } from "@formepdf/react";'
    );
    out = out.replace(
      /return\s+<\s*View\s+break\s+style=\{style\}\s*\/>;/,
      "return <FormePageBreak />;"
    );
  }

  // Text render callback → Forme page number placeholders
  out = out.replaceAll(
    /<PDFText\s+style=\{textStyles\}\s+render=\{\(\{\s*pageNumber,\s*totalPages\s*\}\)\s*=>\s*formatPageNumber\(format,\s*pageNumber,\s*totalPages\)\}\s*\/>/g,
    `<PDFText style={textStyles}>{format.replace("{page}", "{{pageNumber}}").replace("{total}", "{{totalPages}}")}</PDFText>`
  );

  // fixed={fixed} on View → wrap with Fixed when fixed
  // Keep fixed prop; Forme View doesn't support it — wrap in Fixed for headers/footers in component files manually if needed
  // For now strip unknown props that Forme rejects at typecheck: minPresenceAhead, break
  out = out.replaceAll(/\s+minPresenceAhead=\{[^}]+\}/g, "");
  out = out.replaceAll(/\s+minPresenceAhead=\{minPresenceAhead\}/g, "");

  // View fixed={fixed} — Forme uses <Fixed position="header|footer">
  // Keep as data attribute style passthrough: convert fixed={true} containers later in specific files
  out = out.replaceAll(
    /\s+fixed=\{fixed\}/g,
    " /* fixed handled by Fixed wrapper when needed */ "
  );
  out = out.replaceAll(/\s+fixed=\{true\}/g, "");
  out = out.replaceAll(/\s+fixed\b(?!=)/g, "");

  // Clean broken comments from fixed replacement
  out = out.replaceAll(
    /\s*\/\*\s*fixed handled by Fixed wrapper when needed\s*\*\//g,
    ""
  );

  return out;
};

const transformTakumi = (content: string) => {
  let out = transformCommon(content);
  out = out.replaceAll(
    "@/registry/bases/PLACEHOLDER/components",
    "@/registry/bases/takumi/components"
  );

  // Replace react-pdf imports with local primitives + react
  out = out.replaceAll(
    /import\s+\{([^}]+)\}\s+from\s+['"]@react-pdf\/renderer['"];?/g,
    (_m, imports: string) => {
      const list = imports
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const needs = {
        document: list.includes("Document"),
        image: list.includes("Image"),
        link: list.includes("Link"),
        page: list.includes("Page"),
        stylesheet: list.includes("StyleSheet"),
        svg: list.some((i) =>
          [
            "Svg",
            "Rect",
            "Circle",
            "G",
            "Line",
            "Path",
            "Text as SvgText",
          ].includes(i)
        ),
        text: list.some((i) => i === "Text" || i.startsWith("Text as")),
        view: list.some((i) => i === "View"),
      };

      const lines: string[] = [];
      const fromPrim: string[] = [];
      if (needs.view) {
        fromPrim.push("View");
      }
      if (needs.text) {
        for (const i of list) {
          if (i === "Text" || i.startsWith("Text as")) {
            fromPrim.push(i === "Text" ? "Text" : i);
          }
        }
      }
      if (needs.stylesheet) {
        fromPrim.push("StyleSheet");
      }
      if (needs.image) {
        fromPrim.push("Image");
      }
      if (needs.link) {
        fromPrim.push("Link");
      }
      if (needs.document) {
        fromPrim.push("Document");
      }
      if (needs.page) {
        fromPrim.push("Page");
      }
      if (fromPrim.length) {
        lines.push(
          `import { ${[...new Set(fromPrim)].join(", ")} } from "../../lib/takumi-primitives";`
        );
      }
      if (needs.svg) {
        // Use react for SVG elements in Takumi
        const svgImports = list.filter((i) =>
          ["Svg", "Rect", "Circle", "G", "Line", "Path"].includes(i)
        );
        // Text as SvgText → text as SVG text element - import as SvgText from primitives
        if (list.includes("Text as SvgText")) {
          lines.push(
            `import { ${[...svgImports, "SvgText"].join(", ")} } from "../../lib/takumi-svg";`
          );
        } else if (svgImports.length) {
          lines.push(
            `import { ${svgImports.join(", ")} } from "../../lib/takumi-svg";`
          );
        }
      }
      return lines.join("\n");
    }
  );

  out = out.replaceAll(
    /import\s+type\s+\{([^}]+)\}\s+from\s+['"]@react-pdf\/types['"];?/g,
    'import type { Style } from "../../lib/takumi-primitives";'
  );

  // Page break
  out = out.replace(
    /return\s+<\s*View\s+break\s+style=\{style\}\s*\/>;/,
    'return <View style={[{ breakBefore: "page" as const }, style].filter(Boolean)} />;'
  );

  // Page number render callback → Takumi pageNumber/totalPages spans
  out = out.replaceAll(
    /<PDFText\s+style=\{textStyles\}\s+render=\{\(\{\s*pageNumber,\s*totalPages\s*\}\)\s*=>\s*formatPageNumber\(format,\s*pageNumber,\s*totalPages\)\}\s*\/>/g,
    `<PDFText style={textStyles}>
        {format.split(/({page}|{total})/).map((part, i) => {
          if (part === "{page}") return <span key={i} className="pageNumber" />;
          if (part === "{total}") return <span key={i} className="totalPages" />;
          return <span key={i}>{part}</span>;
        })}
      </PDFText>`
  );

  // keep-together / wrap={false} → breakInside avoid
  out = out.replaceAll(
    /<View\s+wrap=\{false\}\s+minPresenceAhead=\{minPresenceAhead\}\s+style=\{style\}>/g,
    '<View style={[{ breakInside: "avoid" as const }, style].filter(Boolean)}>'
  );
  out = out.replaceAll(
    /<View\s+wrap=\{false\}(\s+style=\{[^}]+\})?>/g,
    '<View style={[{ breakInside: "avoid" as const }$1].filter(Boolean)}>'
  );
  out = out.replaceAll("wrap={noWrap ? false : undefined}", "");
  out = out.replaceAll("wrap={false}", "");
  out = out.replaceAll(/\s+minPresenceAhead=\{[^}]+\}/g, "");
  out = out.replaceAll(/\s+fixed=\{fixed\}/g, "");
  out = out.replaceAll(/\s+fixed=\{true\}/g, "");
  out = out.replaceAll(/\s+fixed\b(?!=)/g, "");

  return out;
};

const portLib = (base: "takumi" | "forme") => {
  const libDir = path.join(ROOT, `registry/bases/${base}/lib`);
  ensureDir(libDir);

  // theme default
  write(
    path.join(libDir, "pdfcn-theme.ts"),
    `import { professionalTheme } from "@/registry/themes";\n\nexport const theme = professionalTheme;\n`
  );

  // context
  let ctx = read(path.join(SRC, "lib/pdfx-theme-context.tsx"));
  ctx = transformCommon(ctx).replaceAll("pdfx-theme", "pdfcn-theme");
  write(path.join(libDir, "pdfcn-theme-context.tsx"), ctx);

  // resolve-color
  let resolve = read(path.join(SRC, "lib/resolve-color.ts"));
  resolve = transformCommon(resolve);
  write(path.join(libDir, "resolve-color.ts"), resolve);

  if (base === "takumi") {
    write(
      path.join(libDir, "takumi-primitives.tsx"),
      `import type { CSSProperties, ReactNode, ImgHTMLAttributes, AnchorHTMLAttributes } from "react";

export type Style = CSSProperties;

export const StyleSheet = {
  create<T extends Record<string, Style>>(styles: T): T {
    return styles;
  },
};

type ViewProps = {
  children?: ReactNode;
  style?: Style | Style[] | false | null | undefined;
  className?: string;
  wrap?: boolean;
  fixed?: boolean;
  break?: boolean;
  minPresenceAhead?: number;
};

const flatten =(style?: ViewProps["style"]): CSSProperties | undefined => {
  if (!style) return undefined;
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.filter(Boolean));
  }
  return style;
}

export const View =({ children, style, className, ...rest }: ViewProps) => {
  const { wrap: _w, fixed: _f, break: br, minPresenceAhead: _m, ...dom } = rest as ViewProps & Record<string, unknown>;
  const merged = flatten(style) ?? {};
  if (br) Object.assign(merged, { breakBefore: "page" });
  return (
    <div className={className} style={merged} {...(dom as object)}>
      {children}
    </div>
  );
}

type TextProps = {
  children?: ReactNode;
  style?: Style | Style[] | false | null | undefined;
  className?: string;
  render?: (info: { pageNumber: number; totalPages: number }) => ReactNode;
  fixed?: boolean;
  href?: string;
};

export const Text =({ children, style, className, render: _render, href, ...rest }: TextProps) => {
  const merged = flatten(style);
  if (href) {
    return (
      <a href={href} className={className} style={merged} {...(rest as object)}>
        {children}
      </a>
    );
  }
  return (
    <span className={className} style={merged} {...(rest as object)}>
      {children}
    </span>
  );
}

export const Image =({
  src,
  style,
  ...rest
}: { src: string; style?: Style | Style[] } & ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={src} style={flatten(style)} alt="" {...rest} />;
}

export const Link =({
  src,
  children,
  style,
  ...rest
}: {
  src: string;
  children?: ReactNode;
  style?: Style | Style[];
} & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a href={src} style={flatten(style)} {...rest}>
      {children}
    </a>
  );
}

export const Document =({
  children,
  title,
  style,
}: {
  children?: ReactNode;
  title?: string;
  style?: Style | Style[];
}) => {
  return (
    <div data-pdf-document={title} style={flatten(style)}>
      {children}
    </div>
  );
}

export const Page =({
  children,
  size: _size,
  style,
}: {
  children?: ReactNode;
  size?: string | { width: number; height: number };
  style?: Style | Style[];
}) => {
  return (
    <div data-pdf-page style={flatten(style)}>
      {children}
    </div>
  );
}
`
    );

    write(
      path.join(libDir, "takumi-svg.tsx"),
      `import type { CSSProperties, ReactNode, SVGProps } from "react";

export const Svg =({
  children,
  style,
  ...rest
}: SVGProps<SVGSVGElement> & { style?: CSSProperties }) => {
  return (
    <svg style={style} {...rest}>
      {children}
    </svg>
  );
}

export const Rect =(props: SVGProps<SVGRectElement>) => {
  return <rect {...props} />;
}
export const Circle =(props: SVGProps<SVGCircleElement>) => {
  return <circle {...props} />;
}
export const G =(props: SVGProps<SVGGElement>) => {
  return <g {...props} />;
}
export const Line =(props: SVGProps<SVGLineElement>) => {
  return <line {...props} />;
}
export const Path =(props: SVGProps<SVGPathElement>) => {
  return <path {...props} />;
}
export const SvgText =({
  children,
  style,
  ...rest
}: SVGProps<SVGTextElement> & { children?: ReactNode; style?: CSSProperties }) => {
  return (
    <text style={style} {...rest}>
      {children}
    </text>
  );
}
`
    );
  }
};

const portFile = (rel: string, base: "takumi" | "forme") => {
  const srcFile = path.join(SRC, rel);
  if (!fs.existsSync(srcFile)) {
    return;
  }
  const raw = read(srcFile);
  const transformed =
    base === "forme" ? transformForme(raw) : transformTakumi(raw);
  const destRel = rel
    .replaceAll("pdfx-theme", "pdfcn-theme")
    .replaceAll("pdfx-theme-context", "pdfcn-theme-context");
  write(path.join(ROOT, `registry/bases/${base}`, destRel), transformed);
};

const main = () => {
  // Shared themes
  const themesDir = path.join(ROOT, "registry/themes");
  ensureDir(themesDir);

  // theme-types
  write(
    path.join(themesDir, "theme-types.ts"),
    renameShared(read(path.join(SHARED, "theme.ts"))).replaceAll(
      "PdfxTheme",
      "PdfcnTheme"
    )
  );

  // component-types — Style from a local alias
  write(
    path.join(themesDir, "component-types.ts"),
    `import type { ReactNode } from "react";

/** CSS-like style object compatible with both Takumi and Forme */
export type Style = Record<string, string | number | undefined | Style | Style[]>;

/**
 * Base props shared by all pdfcn PDF components.
 */
export interface PDFComponentProps {
  style?: Style;
  children: ReactNode;
}
`
  );

  // Copy theme presets
  for (const file of fs.readdirSync(path.join(SHARED, "themes"))) {
    if (!file.endsWith(".ts")) {
      continue;
    }
    let content = read(path.join(SHARED, "themes", file));
    content = renameShared(content).replaceAll("PdfxTheme", "PdfcnTheme");
    content = content.replaceAll("from '../theme.js'", 'from "../theme-types"');
    content = content.replaceAll(
      "from './primitives.js'",
      'from "./primitives"'
    );
    content = content.replaceAll(/from '\.\/(\w+)\.js'/g, 'from "./$1"');
    write(path.join(themesDir, file), content);
  }

  // themes barrel + re-exports
  write(
    path.join(themesDir, "index.ts"),
    `export type { PDFComponentProps, Style } from "./component-types";
export type {
  PdfcnTheme,
  PrimitiveTokens,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  PageTokens,
  TypographyScale,
  SpacingScale,
  FontWeights,
  LineHeights,
  BorderRadiusScale,
  LetterSpacingScale,
} from "./theme-types";

export {
  defaultPrimitives,
  professionalTheme,
  modernTheme,
  minimalTheme,
  executiveTheme,
  corporateTheme,
  elegantTheme,
  vividTheme,
  forestTheme,
  blueprintTheme,
  themePresets,
  type ThemePresetName,
} from "./themes-barrel";
`
  );

  // Fix themes index from pdfx → themes-barrel
  let themesIndex = read(path.join(SHARED, "themes/index.ts"));
  themesIndex = renameShared(themesIndex);
  themesIndex = themesIndex.replaceAll(/from '\.\/(\w+)\.js'/g, 'from "./$1"');
  write(path.join(themesDir, "themes-barrel.ts"), themesIndex);

  // Fix theme-types PdfcnTheme name
  let themeTypes = read(path.join(themesDir, "theme-types.ts"));
  themeTypes = themeTypes.replaceAll("PdfxTheme", "PdfcnTheme");
  write(path.join(themesDir, "theme-types.ts"), themeTypes);

  for (const base of ["takumi", "forme"] as const) {
    portLib(base);

    // components + blocks
    for (const file of walk(path.join(SRC, "components"))) {
      const rel = path.relative(SRC, file);
      portFile(rel, base);
    }
    for (const file of walk(path.join(SRC, "blocks"))) {
      const rel = path.relative(SRC, file);
      portFile(rel, base);
    }

    // Fix block imports that referenced @pdfx/components
    // And relative component imports in blocks
    const blockFiles = walk(path.join(ROOT, `registry/bases/${base}/blocks`));
    for (const file of blockFiles) {
      let c = read(file);
      c = c.replaceAll(
        `@/registry/bases/${base}/components`,
        `../../components`
      );
      // Blocks import from barrel — create relative imports
      c = c.replaceAll(
        /from ['"]@pdfx\/components['"]/g,
        `from "../../components"`
      );
      c = c.replaceAll(
        /from ['"]@\/registry\/bases\/PLACEHOLDER\/components['"]/g,
        `from "../../components"`
      );
      write(file, c);
    }

    // registry.ts for base
    write(
      path.join(ROOT, `registry/bases/${base}/registry.ts`),
      `export const ${base === "takumi" ? "takumi" : "forme"}RegistryBase = {
  examplesDir: "examples/${base}",
  name: "${base}",
  publicRegistryDir: null,
  sourceDir: "registry/bases/${base}",
} as const;
`
    );
  }

  // Fix forme page-break specifically
  for (const base of ["forme"] as const) {
    const pb = path.join(
      ROOT,
      `registry/bases/${base}/components/page-break/page-break.tsx`
    );
    write(
      pb,
      `import type { PDFComponentProps } from "@/registry/themes";
import { PageBreak as FormePageBreak } from "@formepdf/react";

export interface PageBreakProps extends Omit<PDFComponentProps, "children"> {
  children?: never;
}

export const PageBreak =(_props: PageBreakProps) => {
  return <FormePageBreak />;
}
`
    );

    const pn = path.join(
      ROOT,
      `registry/bases/${base}/components/page-number/page-number.tsx`
    );
    let pageNum = read(pn);
    // Ensure Forme placeholders
    if (!pageNum.includes("{{pageNumber}}")) {
      pageNum = pageNum.replace(
        /<PDFText([^>]*)\/>/,
        `<PDFText$1>{format.replace("{page}", "{{pageNumber}}").replace("{total}", "{{totalPages}}")}</PDFText>`
      );
      // remove render prop versions if still present
      pageNum = pageNum.replaceAll(/\s+render=\{[^}]+\}/g, "");
      write(pn, pageNum);
    }

    const kt = path.join(
      ROOT,
      `registry/bases/${base}/components/keep-together/keep-together.tsx`
    );
    write(
      kt,
      `import type { Style } from "@/registry/themes";
import { View } from "@formepdf/react";
import type { ReactNode } from "react";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export const KeepTogether =({ children, style }: KeepTogetherProps) => {
  return (
    <View wrap={false} style={style as never}>
      {children}
    </View>
  );
}
`
    );
  }

  // Fix takumi keep-together / page-break / page-number
  write(
    path.join(
      ROOT,
      "registry/bases/takumi/components/keep-together/keep-together.tsx"
    ),
    `import type { Style } from "@/registry/themes";
import type { ReactNode } from "react";
import { View } from "../../lib/takumi-primitives";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export const KeepTogether =({ children, style }: KeepTogetherProps) => {
  return (
    <View style={[{ breakInside: "avoid" }, style as never].filter(Boolean)}>
      {children}
    </View>
  );
}
`
  );

  write(
    path.join(
      ROOT,
      "registry/bases/takumi/components/page-break/page-break.tsx"
    ),
    `import type { PDFComponentProps } from "@/registry/themes";
import { View } from "../../lib/takumi-primitives";

export interface PageBreakProps extends Omit<PDFComponentProps, "children"> {
  children?: never;
}

export const PageBreak =({ style }: PageBreakProps) => {
  return <View style={[{ breakBefore: "page" }, style as never].filter(Boolean)} />;
}
`
  );

  console.log("Port complete.");
  console.log(
    "takumi components:",
    fs.readdirSync(path.join(ROOT, "registry/bases/takumi/components")).length
  );
  console.log(
    "forme components:",
    fs.readdirSync(path.join(ROOT, "registry/bases/forme/components")).length
  );
  console.log(
    "takumi blocks:",
    fs.readdirSync(path.join(ROOT, "registry/bases/takumi/blocks")).length
  );
  console.log(
    "forme blocks:",
    fs.readdirSync(path.join(ROOT, "registry/bases/forme/blocks")).length
  );
};

main();
