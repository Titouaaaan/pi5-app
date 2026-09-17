import { fixupConfigRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // Build output and generated types.
    ignores: [".next/**", ".next-build/**", "next-env.d.ts"],
  },
  // fixup: eslint-plugin-react (via eslint-config-next) still uses context
  // methods ESLint 10 removed; @eslint/compat shims them until it updates.
  ...fixupConfigRules(nextVitals),
  ...fixupConfigRules(nextTs),
];

export default eslintConfig;
