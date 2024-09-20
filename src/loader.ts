import type { LoaderContext } from 'webpack';
import { validate } from 'schema-utils';
import { parse, resolve } from 'path';
import { camelCase, upperFirst } from 'lodash';
// @ts-expect-error TODO: update sdk
import { CompilerCli, CompilerHttpNode, getFileSystem } from '@aeternity/aepp-sdk';
import { defaultCompilerUrl } from './utils';

export interface Options {
  compilerType?: 'cli' | 'http';
  compilerPath?: string;
  compilerUrl?: string;
}

const optionsSchema = {
  type: 'object',
  properties: {
    compilerType: {
      type: 'string',
    },
    compilerPath: {
      type: 'string',
    },
    compilerUrl: {
      type: 'string',
    },
  },
} as const;

function sortKeys(_key: string, value: unknown): unknown {
  if (typeof value !== 'object' || value == null || Array.isArray(value)) return value;
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}

const renderTemplate = (name: string, options: unknown): string =>
  `import { Contract } from '@aeternity/aepp-sdk';

const compiledContractOptions = ${JSON.stringify(options, sortKeys, 2)};

export default class ${name}Contract extends Contract {
  constructor(options) {
    super({ ...options, ...compiledContractOptions });
  }

  static async initialize(options) {
    return Contract.initialize({ ...options, ...compiledContractOptions });
  }
}
`;

async function loader(context: LoaderContext<Options>): Promise<string> {
  const options = {
    compilerType: 'cli',
    compilerUrl: defaultCompilerUrl,
    ...context.getOptions(),
  };

  validate(optionsSchema, options, {
    name: 'Sophia Contract Loader',
    baseDataPath: 'options',
  });

  const fileSystem = getFileSystem(context.resourcePath);
  const resourceDir = parse(context.resourcePath).dir;
  Object.keys(fileSystem).forEach((file) => context.addDependency(resolve(resourceDir, file)));

  const compiler =
    options.compilerType === 'cli'
      ? new CompilerCli(options.compilerPath)
      : new CompilerHttpNode(options.compilerUrl);
  const contractName = upperFirst(camelCase(parse(context.resourcePath).name));

  return renderTemplate(contractName, await compiler.compile(context.resourcePath));
}

export default async function load(this: LoaderContext<Options>): Promise<void> {
  const callback = this.async();
  try {
    callback(null, await loader(this));
  } catch (error) {
    callback(error);
  }
}
