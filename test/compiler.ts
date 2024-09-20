import path from 'path';
import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';
import { Options } from '../src/loader';

// based on https://webpack.js.org/contribute/writing-a-loader/#testing
export default async (fixture: string, options?: Options): Promise<webpack.Stats> => {
  const compiler = webpack({
    context: import.meta.dirname,
    mode: 'production',
    entry: `./${fixture}`,
    output: {
      path: path.resolve(import.meta.dirname),
      filename: 'bundle.js',
    },
    externals: {
      '@aeternity/aepp-sdk': { root: '@aeternity/aepp-sdk' },
    },
    module: {
      rules: [
        {
          test: /\.aes$/,
          use: {
            loader: path.resolve(import.meta.dirname, '../src/loader.ts'),
            options,
          },
        },
      ],
    },
  });

  // TODO: remove type assertion after solving https://github.com/streamich/memfs/issues/1022
  compiler.outputFileSystem = createFsFromVolume(new Volume()) as NonNullable<
    typeof compiler.outputFileSystem
  >;
  compiler.outputFileSystem.join = path.join.bind(path) as typeof path.join;

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (stats == null || err != null) {
        reject(err);
        return;
      }
      if (stats.hasErrors()) {
        reject(stats.toJson().errors);
        return;
      }
      if (stats.hasWarnings()) {
        reject(stats.toJson().warnings);
        return;
      }

      resolve(stats);
    });
  });
};
