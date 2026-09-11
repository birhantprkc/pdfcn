import { FormeIcon, TakumiIcon } from "@/components/icons";
import { formeRegistryBase } from "@/registry/bases/forme/registry";
import { takumiRegistryBase } from "@/registry/bases/takumi/registry";

export const BASES = [
  {
    ...takumiRegistryBase,
    dependencies: ["takumi-pdf", "@takumi-rs/helpers"],
    description:
      "Paged selectable-text PDF from JSX/Tailwind via Takumi WASM — preview with react-pdf.",
    meta: {
      logo: TakumiIcon,
    },
    title: "Takumi",
    type: "registry:style" as const,
  },
  {
    ...formeRegistryBase,
    dependencies: ["@formepdf/react", "@formepdf/core"],
    description:
      "React PDF components rendered with Forme’s WASM layout engine — browser and server.",
    meta: {
      logo: FormeIcon,
    },
    title: "Forme",
    type: "registry:style" as const,
  },
] as const;

export type Base = (typeof BASES)[number];
export type BaseName = Base["name"];

export const DEFAULT_BASE = BASES[0].name;

export const BASE_NAMES = BASES.map((base) => base.name) as [
  BaseName,
  ...BaseName[],
];

export const getBase = (name: BaseName) =>
  BASES.find((base) => base.name === name);
