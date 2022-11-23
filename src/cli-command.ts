import { Command } from 'commander';
import { resolve, parse } from 'path';
import { defaultCompilerUrl } from './utils';

export default (runWebpackCli: (args: string[]) => Promise<void>): Command => {
  if (process.env.npm_package_version == null) throw new Error('Can\'t get package version');

  return new Command()
    .name('contract-builder')
    .version(process.env.npm_package_version)
    .description('Build specified contracts into JS modules')
    .argument('<contracts...>', 'contracts to build')
    .option('-w, --watch', 'enter watch mode, which rebuilds on contract change.')
    .option('--compiler-url <compilerUrl>', 'compiler URL using to build contracts.', defaultCompilerUrl)
    .action(async (
      contracts: string[],
      { watch, compilerUrl }: { watch?: boolean; compilerUrl: string },
    ): Promise<void> => {
      const args = [
        ...process.argv.slice(0, 2),
        '--config',
        resolve(parse(process.argv[1]).dir, 'webpack.config.js'),
        '--env',
        `contracts=${contracts.map((contract) => resolve(contract)).join(',')}`,
        watch === true ? '--watch' : '',
        '--env',
        `compilerUrl=${compilerUrl}`,
      ];
      await runWebpackCli(args);
    });
};
