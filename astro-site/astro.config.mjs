// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const optimizerExclusions = [
  "@playwright/test",
  "playwright",
  "vitest",
  "aria-query",
  "axobject-query",
  "html-escaper",
  "astro > aria-query",
  "astro > axobject-query",
  "astro > html-escaper",
  "astro > astro/runtime/client/dev-toolbar/entrypoint.js",
  "astro/runtime/client/dev-toolbar/entrypoint.js",
];

function disableAstroDevToolbarOptimizer() {
  return {
    name: "csrevision:disable-astro-dev-toolbar-optimizer",
    enforce: "post",
    configResolved(config) {
      config.optimizeDeps.noDiscovery = true;
      config.optimizeDeps.include = [];
      config.optimizeDeps.exclude = Array.from(
        new Set([...(config.optimizeDeps.exclude ?? []), ...optimizerExclusions])
      );

      const clientOptimizer = config.environments?.client?.optimizeDeps;
      if (clientOptimizer) {
        clientOptimizer.noDiscovery = true;
        clientOptimizer.include = [];
        clientOptimizer.exclude = Array.from(
          new Set([...(clientOptimizer.exclude ?? []), ...optimizerExclusions])
        );
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  vite: {
    optimizeDeps: {
      noDiscovery: true,
      include: [],
      exclude: optimizerExclusions,
    },
    environments: {
      client: {
        optimizeDeps: {
          noDiscovery: true,
          include: [],
          exclude: optimizerExclusions,
        },
      },
    },
    plugins: [tailwindcss(), disableAstroDevToolbarOptimizer()]
  }
});
