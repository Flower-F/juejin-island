import { resolve } from 'path';
import fs from 'fs-extra';
import { loadConfigFromFile } from 'vite';
import { UserConfig } from '../shared/type/index';

type RawConfig = UserConfig | Promise<UserConfig> | (() => UserConfig | Promise<UserConfig>);

export async function resolveConfig(root: string, command: 'serve' | 'build', mode: 'production' | 'development') {
  // 1. 获取配置文件路径，要支持 js 和 ts 两种格式
  const configPath = getUserConfigPath(root);
  // 2. 解析配置文件
  const result = await loadConfigFromFile(
    {
      command,
      mode,
    },
    configPath,
    root,
  );

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    // 1. object
    // 2. Promise
    // 3. function
    const userConfig = await (typeof rawConfig === 'function' ? rawConfig() : rawConfig);
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    const configPath = supportConfigFiles.map((file) => resolve(root, file)).find(fs.pathExistsSync);
    return configPath;
  } catch (error) {
    console.log('Failed to load the user config: ', error);
    throw new Error(error);
  }
}
