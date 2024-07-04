import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addTemplate,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "my-module",
    configKey: "myModule",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    const pluginPath = resolver.resolve("./runtime/plugin.ts");

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(pluginPath);
    addTemplate({
      filename: "types/xmorthi.d.ts",
      getContents: () =>
        [
          `declare module '#xmorthi' {`,
          `  const createLogger: typeof import('${pluginPath}').createLogger`,
          "}",
        ].join("\n"),
    });

    _nuxt.hook("prepare:types", (options: any) => {
      options.references.push({
        path: resolver.resolve(_nuxt.options.buildDir, "types/xmorthi.d.ts"),
      });
    });
  },
});
