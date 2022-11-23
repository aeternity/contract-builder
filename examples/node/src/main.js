import {
  Node, AeSdk, MemoryAccount, Contract,
} from '@aeternity/aepp-sdk';
// eslint-disable-next-line import/extensions,import/no-unresolved
import TestContract from './Test.js';

const aeSdk = new AeSdk({
  nodes: [{ name: 'testnet', instance: new Node('https://testnet.aeternity.io') }],
  accounts: [
    new MemoryAccount('bf66e1c256931870908a649572ed0257876bb84e3cdf71efb12f56c7335fad54d5cf08400e988222f26eb4b02c8f89077457467211a6e6d955edb70749c6a33b'),
  ],
});

// eslint-disable-next-line no-underscore-dangle
const contract = await TestContract.initialize(aeSdk._getOptions());
console.log('Instanceof works correctly for contract', contract instanceof Contract);
const deployInfo = await contract.$deploy([]);
console.log('Contract deployed at', deployInfo.address);
const { decodedResult } = await contract.getArg(32);
console.log('Call result', decodedResult);
