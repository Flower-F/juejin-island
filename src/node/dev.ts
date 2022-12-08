import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-island/config';

export async function createDevServer(root: string, restart: () => Promise<void>) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log('config:', config.siteData);

  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact(), pluginConfig(config, restart)],
    server: {
      // 说明根目录下的文件都是合法文件
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  });
}
