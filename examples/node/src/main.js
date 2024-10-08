import { Node, AeSdk, MemoryAccount, Contract } from '@aeternity/aepp-sdk';
import TestContract from './Test.js';

const aeSdk = new AeSdk({
  nodes: [{ name: 'testnet', instance: new Node('https://testnet.aeternity.io') }],
  accounts: [
    new MemoryAccount(
      '9ebd7beda0c79af72a42ece3821a56eff16359b6df376cf049aee995565f022f840c974b97164776454ba119d84edc4d6058a8dec92b6edc578ab2d30b4c4200',
    ),
  ],
});

const contract = await TestContract.initialize(aeSdk.getContext());
console.log('Instanceof works correctly for contract', contract instanceof Contract);
const deployInfo = await contract.$deploy([]);
console.log('Contract deployed at', deployInfo.address);
const { decodedResult } = await contract.getArg(32);
console.log('Call result', decodedResult);
