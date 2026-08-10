import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, react, next, vitest],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    "public/r/**",
    ".pnpm-store/**",
    ".registry-build/**",
    ".agents/**",
    ".cursor/**",
    ".changeset/**",
    ".claude/**",
    ".web-kits/**",
    "audio/**",
  ],
  overrides: [
    {
      files: ["components/playground/**/*.{ts,tsx}"],
      rules: {
        "func-style": "off",
        "nextjs/no-img-element": "off",
        "no-new-func": "off",
        "sort-keys": "off",
        "unicorn/prefer-add-event-listener": "off",
        "unicorn/prefer-native-coercion-functions": "off",
      },
    },
    {
      files: ["examples/**/*.{ts,tsx}"],
      rules: {
        "arrow-body-style": "off",
        "sort-keys": "off",
      },
    },
    {
      files: ["registry/bases/takumi/lib/takumi-primitives.tsx"],
      rules: {
        "nextjs/no-img-element": "off",
      },
    },
  ],
});
