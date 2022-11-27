import * as path from 'path';
import { build as viteBuild, InlineConfig } from 'vite';
import { RollupOutput } from 'rollup';
import pluginReact from '@vitejs/plugin-react';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import * as fs from 'fs-extra';

export async function bundle(root: string) {
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? '.temp' : 'build',
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm',
            },
          },
        },
        plugins: [pluginReact()],
      };
    };

    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };

    console.log('Building client and server bundles...');
    // await clientBuild();
    // await serverBuild();
    const [clientBundle, serverBundle] = await Promise.all([clientBuild(), serverBuild()]);

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (e) {
    console.log('Error: ', e);
  }
}

export async function renderPage(render: () => string, root: string, clientBundle: RollupOutput) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry);

  // 拼接 html，注入 js 脚本文件
  const html = `
    <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>title</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/${clientChunk.fileName}" type="module"></script>
      </body>
    </html>
  `.trim();

  // 将产物写到本地
  await fs.writeFile(path.join(root, 'build', 'index.html'), html);
  await fs.remove(path.join(root, '.temp'));
}

export async function build(root: string) {
  // 1. 打包 client 和 server 的 bundle
  const [clientBundle] = await bundle(root);
  // 2. 引入 ssr-entry 模块的打包产物
  const ssrEntryPath = path.resolve(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产出 html
  const { render } = require(ssrEntryPath);
  await renderPage(render, root, clientBundle);
}
