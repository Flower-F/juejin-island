import { Plugin } from 'vite';
import { readFile } from 'fs/promises';
import { CLIENT_ENTRY_PATH, DEFAULT_TEMPLATE_PATH } from '../constants';

export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    // 增加 script 标签
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              // vite 约定 @fs 开头为绝对路径
              src: `/@fs/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: 'body',
          },
        ],
      };
    },
    configureServer(server) {
      return () => {
        // 保险起见在这里执行，否则可能会影响其他 vite 中间件的行为
        server.middlewares.use(async (req, res, next) => {
          // 1 读取 template.html 的内容
          // 不能热更新
          // const content = await readFile(DEFAULT_TEMPLATE_PATH, 'utf-8');
          let content = await readFile(DEFAULT_TEMPLATE_PATH, 'utf-8');
          content = await server.transformIndexHtml(req.url, content, req.originalUrl);
          // 2 响应 html
          res.setHeader('Content-Type', 'text/html');
          res.end(content);
        });
      };
    },
  };
}
