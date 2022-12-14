import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-island/config';

export async function createDevServer(root: string, restart: () => Promise<void>) {
  const config = await resolveConfig(root, 'serve', 'development');

  return createServer({
    // 若此处不设置 root，会导致 vite 接管静态资源处理，然后直接显示 tsx 文件内容
    root: PACKAGE_ROOT,
    plugins: [pluginIndexHtml(), pluginReact(), pluginConfig(config, restart)],
    server: {
      // 说明根目录下的文件都是合法文件
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  });
}
