import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addTemplate,
} from '@nuxt/kit';
import { defu } from 'defu';

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@xmorthi/nuxt-utils',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    const pluginPath = resolver.resolve('./runtime/plugin');
    const alias = 'xmorthi' as const;

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(pluginPath);
    _nuxt.hook('nitro:config', (nitroConfig: any) => {
      nitroConfig.alias = nitroConfig.alias || {};

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {},
        {
          inline: [resolver.resolve('./runtime')],
        }
      );
      nitroConfig.alias[`#${alias}`] = pluginPath;
    });
    addTemplate({
      filename: `types/${alias}.d.ts`,
      getContents: () =>
        [
          `declare module '#${alias}' {`,
          `  const createLogger: typeof import('${pluginPath}').createLogger`,
          '}',
        ].join('\n'),
    });

    _nuxt.hook('prepare:types', (options: any) => {
      options.references.push({
        path: resolver.resolve(_nuxt.options.buildDir, 'types/xmorthi.d.ts'),
      });
    });
  },
});
