import fastGlob from 'fast-glob';
import path from 'path';
import { normalizePath } from 'vite';

interface RouteData {
  routePath: string;
  fileAbsolutePath: string;
}

export class RouteService {
  private scanDir: string;
  private routeData: RouteData[] = [];

  constructor(scanDir: string) {
    this.scanDir = scanDir;
  }

  async init() {
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this.scanDir,
        absolute: true,
        ignore: ['**/build/**', '**/.island/**', 'config.ts'],
      })
      .sort();
    files.forEach((file) => {
      const fileRelativePath = normalizePath(path.relative(this.scanDir, file));
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.routeData.push({
        routePath,
        fileAbsolutePath: file,
      });
    });
  }

  getRouteData() {
    return this.routeData;
  }

  normalizeRoutePath(relativePath: string) {
    const routePath = relativePath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : '/' + routePath;
  }

  generateRoutesCode() {
    return `
      import React from 'react';
      import loadable from '@loadable/component';

      ${this.routeData
        .map((route, index) => {
          // return `import Route${index} from '${route.fileAbsolutePath}';`;
          return `const Route${index} = loadable(() => import('${route.fileAbsolutePath}'));`;
        })
        .join('\n')}
      export const routes = [
        ${this.routeData.map((route, index) => {
          return `{
            path: '${route.routePath}',
            element: React.createElement(Route${index})
          },`;
        })}
      ];
    `;
  }
}
