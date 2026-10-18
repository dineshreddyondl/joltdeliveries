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
 * eslint-config-next 15.5 ships legacy-config format, so the Next presets
 * are loaded via FlatCompat. (Native flat exports arrive with Next 16 —
 * switch to `eslint-config-next/core-web-vitals` + `/typescript` then.)
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
    ],
  },
];

export default eslintConfig;
