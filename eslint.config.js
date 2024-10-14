import muleslint from "@mulekick/eslint-config-muleslint";
// eslint-disable-next-line node/no-missing-import
import typescript from "typescript-eslint";
// add next eslin plugin (flat configs not supported)
// import next from "@next/eslint-plugin-next";

// extend from next recommended config
export default typescript.config(...muleslint, {
    ignores: [ `**/node_modules/**`, `**/.next/**`, `**/.vercel/**`, `**/build/**`, `**/out/**`, `**/standalone/**` ]
});