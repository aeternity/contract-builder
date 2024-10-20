import { Node, AeSdk, MemoryAccount, Contract } from '@aeternity/aepp-sdk';
import TestContract from './Test.js';

const aeSdk = new AeSdk({
  nodes: [{ name: 'testnet', instance: new Node('https://testnet.aeternity.io') }],
  accounts: [new MemoryAccount('sk_2CuofqWZHrABCrM7GY95YSQn8PyFvKQadnvFnpwhjUnDCFAWmf')],
});

const contract = await TestContract.initialize(aeSdk.getContext());
console.log('Instanceof works correctly for contract', contract instanceof Contract);
const deployInfo = await contract.$deploy([]);
console.log('Contract deployed at', deployInfo.address);
const { decodedResult } = await contract.getArg(32);
console.log('Call result', decodedResult);
