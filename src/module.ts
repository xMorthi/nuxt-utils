import { defineNuxtModule, createResolver, addTemplate } from '@nuxt/kit';
import { defu } from 'defu';

export { createLogger } from './runtime/plugin';
export type CreateLogger = typeof import('./runtime/plugin').createLogger;

export default defineNuxtModule({
  meta: {
    name: 'nuxt-utils',
  },
  setup(_options, _nuxt: any) {
    const { resolve } = createResolver(import.meta.url);
    const clientPath = resolve('./runtime/plugin');

    _nuxt.hook('nitro:config', (nitroConfig: any) => {
      nitroConfig.alias = nitroConfig.alias || {};

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {},
        {
          inline: [resolve('./runtime')],
        }
      );
      nitroConfig.alias['#xmorthi-utils'] = clientPath;
    });

    addTemplate({
      filename: 'types/xmorthi-utils.d.ts',
      getContents: () =>
        [
          `declare module '#xmorthi-utils' {`,
          `  const createLogger: typeof import('${clientPath}').createLogger`,
          `  export { createLogger }`,
          '}',
        ].join('\n'),
    });

    _nuxt.hook('prepare:types', (options: any) => {
      options.references.push({
        path: resolve(_nuxt.options.buildDir, 'types/xmorthi-utils.d.ts'),
      });
    });
  },
});
