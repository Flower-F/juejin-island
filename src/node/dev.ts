import { createServer } from 'vite';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { createVitePlugins } from './vitePlugin';

export async function createDevServer(root: string, restartServer: () => Promise<void>) {
  const config = await resolveConfig(root, 'serve', 'development');

  return createServer({
    // 若此处不设置 root，会导致 vite 接管静态资源处理，然后直接显示 tsx 文件内容
    root: PACKAGE_ROOT,
    plugins: createVitePlugins(config, restartServer),
    server: {
      // 说明根目录下的文件都是合法文件
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  });
}
