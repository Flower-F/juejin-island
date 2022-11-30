import path from 'path';
import fs from 'fs-extra';
import * as execa from 'execa';

const EXAMPLE_PATH = path.resolve(__dirname, '../e2e/playground/basic');
const ROOT = path.resolve(__dirname, '..');

const defaultOptions = {
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr,
};

async function prepareE2E() {
  if (!fs.existsSync(path.resolve(__dirname, '../dist'))) {
    // 若还没构建，则执行一下构建任务命令 pnpm build
    execa.execaCommandSync('pnpm build', {
      cwd: ROOT,
      ...defaultOptions,
    });
  }

  // 安装 headless 浏览器
  execa.execaCommandSync('npx playwright install', {
    cwd: ROOT,
    ...defaultOptions,
  });

  // 启动
  execa.execaCommandSync('pnpm dev', {
    cwd: EXAMPLE_PATH,
    ...defaultOptions,
  });
}

prepareE2E();
