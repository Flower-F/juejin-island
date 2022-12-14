import * as path from 'path';
import { build as viteBuild, InlineConfig } from 'vite';
import { RollupOutput } from 'rollup';
import pluginReact from '@vitejs/plugin-react';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import fs from 'fs-extra';
// import ora from 'ora';
import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import { pluginConfig } from './plugin-island/config';

// 通过 dynamicImport，绕过 ts 编译，避免 import 语句被编译为 require
// const dynamicImport = new Function('m', 'return import(m)');

export async function bundle(root: string, config: SiteConfig) {
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
      plugins: [pluginReact(), pluginConfig(config)],
      ssr: {
        noExternal: ['react-router-dom'],
      },
    };
  };

  const clientBuild = async () => {
    return viteBuild(resolveViteConfig(false));
  };

  const serverBuild = async () => {
    return viteBuild(resolveViteConfig(true));
  };

  // const { default: ora } = await dynamicImport('ora');
  // const spinner = ora();
  // spinner.start('Building client and server bundles...');

  try {
    // await clientBuild();
    // await serverBuild();
    const [clientBundle, serverBundle] = await Promise.all([clientBuild(), serverBuild()]);
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (e) {
    console.log(e);
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
        <script src="/${clientChunk?.fileName}" type="module"></script>
      </body>
    </html>
  `.trim();

  // 将产物写到本地
  await fs.ensureDir(path.join(root, 'build'));
  await fs.writeFile(path.join(root, 'build', 'index.html'), html);
  await fs.remove(path.join(root, '.temp'));
}

export async function build(root: string, config: SiteConfig) {
  // 1. 打包 client 和 server 的 bundle
  const [clientBundle] = await bundle(root, config);
  // 2. 引入 ssr-entry 模块的打包产物
  const ssrEntryPath = path.join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产出 html
  const { render } = await import(pathToFileURL(ssrEntryPath).href);
  await renderPage(render, root, clientBundle);
}
