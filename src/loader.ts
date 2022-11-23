import type { LoaderContext } from 'webpack';
import { validate } from 'schema-utils';
import { parse, resolve } from 'path';
import { camelCase, upperFirst } from 'lodash';
import { utils } from '@aeternity/aeproject';
import { Compiler, Contract } from '@aeternity/aepp-sdk';
import { defaultCompilerUrl } from './utils';

const { getFilesystem } = utils;

export interface Options { compilerUrl?: string }

const optionsSchema = {
  type: 'object',
  properties: {
    compilerUrl: {
      type: 'string',
    },
  },
} as const;

const renderTemplate = (name: string, options: unknown): string => ''
+ `import { Contract } from '@aeternity/aepp-sdk';

const compiledContractOptions = ${JSON.stringify(options, null, 2)};

export default class ${name}Contract extends Contract {
  constructor(options) {
    super({ ...options, ...compiledContractOptions });
  }

  static async initialize(options) {
    return Contract.initialize({ ...options, ...compiledContractOptions });
  }
}
`;

async function loader(
  context: LoaderContext<Options>,
  sourceCode: string,
): Promise<string> {
  const options = {
    compilerUrl: defaultCompilerUrl,
    ...context.getOptions(),
  };

  validate(optionsSchema, options, {
    name: 'Sophia Contract Loader',
    baseDataPath: 'options',
  });

  const fileSystem = getFilesystem(context.resourcePath);
  const resourceDir = parse(context.resourcePath).dir;
  Object.keys(fileSystem).forEach((file) => context.addDependency(resolve(resourceDir, file)));
  const onCompiler = new Compiler(options.compilerUrl);
  const contract = await Contract.initialize({ sourceCode, fileSystem, onCompiler });
  const contractName = upperFirst(camelCase(parse(context.resourcePath).name));

  const compiledContractOptions = {
    // eslint-disable-next-line no-underscore-dangle
    aci: contract._aci,
    bytecode: await contract.$compile(),
  };
  return renderTemplate(contractName, compiledContractOptions);
}

export default async function load(
  this: LoaderContext<Options>,
  sourceCode: string,
): Promise<void> {
  const callback = this.async();
  try {
    callback(null, await loader(this, sourceCode));
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    callback(error);
  }
}
