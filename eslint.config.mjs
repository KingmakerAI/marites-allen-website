import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "node_modules/**", "data/**", "public/uploads/**"]),
  // store.ts is not a React module. The cookie and press-kit mount flags are pre-existing.
  {
    files: ["lib/cms/store.ts"],
    rules: { "react-hooks/rules-of-hooks": "off" }
  },
  {
    files: ["components/cookie-notice.tsx", "app/media/media-client.tsx"],
    rules: { "react-hooks/set-state-in-effect": "off" }
  }
]);
