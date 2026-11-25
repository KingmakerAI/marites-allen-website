import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "node_modules/**", "data/**", "public/uploads/**"]),
  {
    files: ["lib/cms/store.ts"],
    rules: {
      // useBlobStore is a storage switch, not a React hook. The name predates this lint rule.
      "react-hooks/rules-of-hooks": "off"
    }
  }
]);
