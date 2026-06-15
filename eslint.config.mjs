// import { defineConfig, globalIgnores } from 'eslint/config'
// import nextVitals from 'eslint-config-next/core-web-vitals'
// import prettier from 'eslint-config-prettier/flat'
 
// const eslintConfig = defineConfig([
//   ...nextVitals,
//   prettier,
//   // Override default ignores of eslint-config-next.
//   globalIgnores([
//     // Default ignores of eslint-config-next:
//     '.next/**',
//     'out/**',
//     'src/**',
//     'build/**',
//     'next-env.d.ts',
//   ]),
// ])
 
// export default eslintConfig

import { defineConfig } from "eslint/config";

export default defineConfig({
  ignores: ["**"],
});
