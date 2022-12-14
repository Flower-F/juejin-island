import cac from 'cac';
import { build } from './build';
import { resolveConfig } from './config';

const cli = cac('island').version('0.0.0').help();

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  const createServer = async () => {
    const { createDevServer } = await import('./dev.js');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };

  try {
    await createServer();
  } catch (error) {
    console.log('Error in cli:dev: ', error);
  }
});

cli.command('build [root]', 'build in production').action(async (root: string) => {
  try {
    const config = await resolveConfig(root, 'build', 'production');
    await build(root, config);
  } catch (error) {
    console.log('Error in cli:build', error);
  }
});

cli.parse();
