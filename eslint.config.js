/* eslint-disable import/no-unresolved */
import muleslint from "@mulekick/eslint-config-muleslint";
import {defineConfig} from 'eslint/config';
// add next eslint plugin (flat configs not supported)
import next from "@next/eslint-plugin-next";

// extend from next recommended config
export default defineConfig(next.configs.recommended, ...muleslint, {
    ignores: [ `next-env.d.ts`, `**/node_modules/**`, `**/.next/**`, `**/.vercel/**`, `**/build/**`, `**/out/**`, `**/standalone/**` ]
});