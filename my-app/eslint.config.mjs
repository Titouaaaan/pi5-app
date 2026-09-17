import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // Build output and generated types.
    ignores: [".next/**", ".next-build/**", "next-env.d.ts"],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
