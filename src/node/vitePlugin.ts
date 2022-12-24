import pluginReact from '@vitejs/plugin-react';
import { SiteConfig } from 'shared/types';
import { Plugin } from 'vite';
import { pluginConfig } from './plugin-island/config';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import { pluginRoutes } from './plugin-routes';
import { createMdxPlugins } from './plugin-mdx';

export function createVitePlugins(config: SiteConfig, restartServer?: () => Promise<void>) {
  return [
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic',
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
    }),
    createMdxPlugins(),
  ] as Plugin[];
}
