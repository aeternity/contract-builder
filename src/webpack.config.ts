import { parse, resolve } from 'path';
import { Configuration } from 'webpack';

export default (
  { contracts, compilerUrl }: { contracts: string; compilerUrl?: string },
): Configuration[] => contracts
  .split(',')
  .map((entry) => ({
    mode: 'production',
    entry,
    output: {
      path: parse(entry).dir,
      filename: `${parse(entry).name}.js`,
      library: {
        type: 'module',
      },
    },
    externals: {
      '@aeternity/aepp-sdk': { module: '@aeternity/aepp-sdk' },
    },
    resolve: {
      extensions: ['.aes'],
    },
    optimization: {
      minimize: false,
    },
    experiments: {
      outputModule: true,
    },
    module: {
      rules: [{
        use: {
          loader: resolve(parse(process.argv[1]).dir, 'loader.js'),
          options: { compilerUrl },
        },
      }],
    },
  }));
