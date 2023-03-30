# @aeternity/contract-builder

[![npm](https://img.shields.io/npm/v/@aeternity/contract-builder.svg)](https://www.npmjs.com/package/@aeternity/contract-builder)
[![npm](https://img.shields.io/npm/l/@aeternity/contract-builder.svg)](https://www.npmjs.com/package/@aeternity/contract-builder)

This package simplifies contract preparation to be used in production by providing:
- a webpack loader to import `.aes` files directly to JavaScript modules;
- a CLI tool called `ae-contract-builder` to be used if webpack is not available or not configurable.

## Usage guide

### Installation
Firstly, you need to add this package to your project
```
$ npm install @aeternity/contract-builder --save-dev
```
To use `aesophia_cli` (enabled by default), `escript` needs to be available in PATH.

### Setup as a webpack loader

Add the loader to your `webpack` config. For example:

**webpack.config.js**

```diff
module.exports = {
  module: {
    rules: [{
+      test: /\.aes$/,
+      use: [{
+        loader: `@aeternity/contract-builder`,
+        options: {
+          compilerType: 'http', // or 'cli'
+          compilerPath: './foo/aesophia_cli',
+          compilerUrl: 'http://localhost:3080/',
+          // the above is optional, uses CLI compiler by default
+        },
      }],
    }],
  },
};
```

And run `webpack` via your preferred method.

### Use as a separate tool

To build a smart contract into JavaScript module use
```
$ npx ae-contract-builder <path-to-contract-source.aes>
```
Also, you can add `--watch` flag to watch for smart contract changes, specify multiple contracts one by one, or add this script to `package.json`.

The output file will be located in the same directory with `.js` extension instead of `.aes`.

### Output format
In both cases, you would get a Contract's child class with inlined ACI and compiled bytecode. It can be used the same as `Contract` class but not needed to provide `aci`, `bytecode`, or `sourceCode`.

```js
import MyContract from './MyContract.aes';
// or import MyContract.js in case using ae-contract-builder

const myContract = await MyContract.initialize(aeSdk._getOptions());
await myContract.$deploy()
await myContract.foo('arg1', 'arg2')
```

## Examples

- [webpack loader in Vue CLI](./examples/vue)
- [`ae-contract-builder` in bare Node project](./examples/node)

## Changelog

We keep our [Changelog](CHANGELOG.md) up to date.
