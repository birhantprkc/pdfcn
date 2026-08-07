import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, out);
    } else if (/\.(tsx|ts)$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

function fixContent(content, base) {
  let c = content;
  c = c.replaceAll(/,\s*=\s*false,/g, ", fixed = false,");
  c = c.replaceAll(/,\s*=\s*true,/g, ", fixed = true,");
  c = c.replaceAll(
    /\s*\/\*\s*handled by Fixed wrapper when needed\s*\*\//g,
    ""
  );
  c = c.replaceAll(
    '@react-pdf/renderer',
    base === "forme" ? "@formepdf/react" : "Takumi PDF primitives"
  );
  c = c.replaceAll('pdfx-theme', "pdfcn-theme");

  if (base === "takumi") {
    // style={[{ breakInside: "avoid" as const } style={foo}].filter(Boolean)}
    c = c.replaceAll(
      /style=\{\[\{\s*breakInside:\s*"avoid"\s*as\s*const\s*\}\s*style=\{([^}]+)\}\]\.filter\(Boolean\)\}/g,
      'style={[{ breakInside: "avoid" as const }, $1].flat().filter(Boolean)}'
    );
  }
  return c;
}

for (const base of ["takumi", "forme"]) {
  const baseDir = path.join(ROOT, `registry/bases/${base}`);
  for (const file of walk(baseDir)) {
    const before = fs.readFileSync(file, "utf-8");
    const after = fixContent(before, base);
    if (after !== before) {
      fs.writeFileSync(file, after);
    }
  }
}

// Forme SVG shim
fs.writeFileSync(
  path.join(ROOT, "registry/bases/forme/lib/forme-svg.tsx"),
  `import { createElement, type ReactNode, type CSSProperties } from "react";
import { Svg as FormeSvg } from "@formepdf/react";

type AnyProps = Record<string, unknown> & { children?: ReactNode; style?: CSSProperties };

export function Svg({
  children,
  width,
  height,
  viewBox,
  style,
  ...rest
}: AnyProps & { width?: number; height?: number; viewBox?: string }) {
  return (
    <FormeSvg
      width={width as number}
      height={height as number}
      viewBox={viewBox as string | undefined}
      style={style as never}
      {...rest}
    >
      {children}
    </FormeSvg>
  );
}

export const Circle = (props: AnyProps) => createElement("circle", props);
export const Rect = (props: AnyProps) => createElement("rect", props);
export const G = (props: AnyProps) => createElement("g", props);
export const Line = (props: AnyProps) => createElement("line", props);
export const Path = (props: AnyProps) => createElement("path", props);
export const SvgText = (props: AnyProps) => createElement("text", props);
`
);

// Fix takumi graph imports
const graphTakumi = path.join(
  ROOT,
  "registry/bases/takumi/components/graph/graph.tsx"
);
const g = fs.readFileSync(graphTakumi, "utf-8");
const lines = g.split("\n");
const cleaned = [];
let sawPrimitives = false;
let sawSvg = false;
for (const line of lines) {
  if (line.includes('from "../../lib/takumi-primitives"')) {
    if (sawPrimitives) {
      continue;
    }
    sawPrimitives = true;
    cleaned.push(
      'import { View, Text as PDFText } from "../../lib/takumi-primitives";'
    );
    cleaned.push('import type { Style } from "../../lib/takumi-primitives";');
    continue;
  }
  if (line.includes('from "../../lib/takumi-svg"')) {
    if (sawSvg) {
      continue;
    }
    sawSvg = true;
    cleaned.push(
      'import { Circle, G, Line, Path, Rect, Svg, SvgText } from "../../lib/takumi-svg";'
    );
    continue;
  }
  if (line.includes("import type { Style }") && sawPrimitives) {
    continue;
  }
  if (line.includes("Text as SvgText")) {
    continue;
  }
  cleaned.push(line);
}
fs.writeFileSync(graphTakumi, cleaned.join("\n"));

// Fix forme graph
const graphForme = path.join(
  ROOT,
  "registry/bases/forme/components/graph/graph.tsx"
);
let gf = fs.readFileSync(graphForme, "utf-8");
gf = gf.replace(
  /import \{ Circle, G, Line, Path, Rect, Svg, Text as SvgText \} from "@formepdf\/react";\nimport \{ Text as PDFText, View \} from "@formepdf\/react";/,
  `import { Text as PDFText, View } from "@formepdf/react";
import { Circle, G, Line, Path, Rect, Svg, SvgText } from "../../lib/forme-svg";`
);
fs.writeFileSync(graphForme, gf);

// Fix forme qrcode
const qrForme = path.join(
  ROOT,
  "registry/bases/forme/components/qrcode/qrcode.tsx"
);
let qr = fs.readFileSync(qrForme, "utf-8");
qr = qr.replace(
  /import \{([^}]+)\} from "@formepdf\/react";/,
  (_m, imports) => {
    const list = imports
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const fromForme = [];
    const fromSvg = [];
    for (const i of list) {
      if (["Svg", "Rect", "Circle", "G", "Line", "Path"].includes(i)) {
        fromSvg.push(i);
      } else if (i === "Text as SvgText") {
        fromSvg.push("SvgText");
      } else {
        fromForme.push(i);
      }
    }
    const linesOut = [];
    if (fromForme.length) {
      linesOut.push(
        `import { ${fromForme.join(", ")} } from "@formepdf/react";`
      );
    }
    if (fromSvg.length) {
      linesOut.push(
        `import { ${[...new Set(fromSvg)].join(", ")} } from "../../lib/forme-svg";`
      );
    }
    return linesOut.join("\n");
  }
);
fs.writeFileSync(qrForme, qr);

// Fix takumi qrcode if needed
const qrTakumi = path.join(
  ROOT,
  "registry/bases/takumi/components/qrcode/qrcode.tsx"
);
let qrt = fs.readFileSync(qrTakumi, "utf-8");
if (qrt.includes("@react-pdf") || qrt.includes("takumi-primitives")) {
  // ensure Svg/Rect from takumi-svg
  if (qrt.includes("Svg") && !qrt.includes("takumi-svg")) {
    qrt = qrt.replace(
      /import \{([^}]+)\} from "\.\.\/\.\.\/lib\/takumi-primitives";/,
      (_m, imports) => {
        const list = imports
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const fromPrim = [];
        const fromSvg = [];
        for (const i of list) {
          if (["Svg", "Rect", "Circle", "G", "Line", "Path"].includes(i)) {
            fromSvg.push(i);
          } else if (i === "Text as SvgText") {
            fromSvg.push("SvgText");
          } else {
            fromPrim.push(i);
          }
        }
        const linesOut = [];
        if (fromPrim.length) {
          linesOut.push(
            `import { ${fromPrim.join(", ")} } from "../../lib/takumi-primitives";`
          );
        }
        if (fromSvg.length) {
          linesOut.push(
            `import { ${[...new Set(fromSvg)].join(", ")} } from "../../lib/takumi-svg";`
          );
        }
        return linesOut.join("\n");
      }
    );
    fs.writeFileSync(qrTakumi, qrt);
  }
}

const leftover = [];
for (const base of ["takumi", "forme"]) {
  for (const file of walk(path.join(ROOT, `registry/bases/${base}`))) {
    const c = fs.readFileSync(file, "utf-8");
    if (
      /,\s*=\s*(false|true)/.test(c) ||
      /breakInside: "avoid" as const \} style=/.test(c)
    ) {
      leftover.push(path.relative(ROOT, file));
    }
  }
}
console.log("leftover mangled:", leftover);
console.log("done");
