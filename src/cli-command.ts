import { Command } from 'commander';
import { resolve, parse } from 'path';
import { defaultCompilerUrl } from './utils';

const compilerCliPathPlaceholder = '<provided by sdk package>';

export default (runWebpackCli: (args: string[]) => Promise<void>): Command => {
  if (process.env.npm_package_version == null) throw new Error("Can't get package version");

  return new Command()
    .name('contract-builder')
    .version(process.env.npm_package_version)
    .description('Build specified contracts into JS modules')
    .argument('<contracts...>', 'contracts to build')
    .option('-w, --watch', 'enter watch mode, which rebuilds on contract change')
    .option('--compiler-type <compilerType>', 'compiler to use (cli or http)', 'cli')
    .option(
      '--compiler-path <compilerPath>',
      'path to CLI compiler using to build contracts',
      compilerCliPathPlaceholder,
    )
    .option(
      '--compiler-url <compilerUrl>',
      'HTTP compiler URL using to build contracts',
      defaultCompilerUrl,
    )
    .action(
      async (
        contracts: string[],
        {
          watch,
          compilerType,
          compilerPath,
          compilerUrl,
        }: {
          watch?: boolean;
          compilerType: 'cli' | 'http';
          compilerPath: string;
          compilerUrl: string;
        },
      ): Promise<void> => {
        const args = [
          ...process.argv.slice(0, 2),
          '--config',
          resolve(parse(process.argv[1]).dir, 'webpack.config.js'),
          '--env',
          `contracts=${contracts.map((contract) => resolve(contract)).join(',')}`,
          watch === true ? '--watch' : '',
          '--env',
          `compilerType=${compilerType}`,
          ...(compilerPath === compilerCliPathPlaceholder
            ? []
            : ['--env', `compilerPath=${compilerPath}`]),
          '--env',
          `compilerUrl=${compilerUrl}`,
        ];
        await runWebpackCli(args);
      },
    );
};
