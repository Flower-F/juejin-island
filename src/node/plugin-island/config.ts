import { relative } from 'path';
import { SiteConfig } from 'shared/types';
import { Plugin } from 'vite';

const SITE_DATA_ID = 'island:site-data';

// 这是一个典型的 Vite 虚拟模块的实现
export function pluginConfig(config: SiteConfig, restart: () => Promise<void>): Plugin {
  return {
    name: 'island:site-data',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        // Vite 约定虚拟模块前面要带上一个 \0
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath];
      const include = (id: string) => customWatchedFiles.some((file) => id.includes(file));

      if (include(ctx.file)) {
        console.log(`\n${relative(config.root, ctx.file)} changed, restarting server...`);
      }

      await restart();
    },
  };
}
