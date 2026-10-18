import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * ESLint 9 flat config for the JOLT site.
 * Uses Next.js's core-web-vitals + typescript presets via FlatCompat
 * (eslint-config-next 15.5 ships legacy-config format; Next 16+ has
 * native flat config).
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "assets/**",
      "design-reference/**",
      "frozen design/**",
      "next-env.d.ts",
      "*.config.mjs",
      "*.config.ts",
    ],
  },
];

export default eslintConfig;
