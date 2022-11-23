import { readFileSync } from 'fs';
import { resolve } from 'path';
import { expect } from 'chai';
import { Contract } from '@aeternity/aepp-sdk';
import compiler from './compiler';
import IdentityContract from './assets/generated-identity';

const transformedIdentity = readFileSync(resolve(__dirname, './assets/generated-identity.ts'))
  .toString()
  .split('\n')
  .slice(2)
  .join('\n');

it('compiles contract and outputs JavaScript', async () => {
  const stats = await compiler('assets/Identity.aes');
  const output = stats.toJson({ source: true }).modules?.[0].modules?.[0].source;
  expect(output).to.be.equal(transformedIdentity);
});

it('generate a proper contract name', async () => {
  const stats = await compiler('assets/identity-LOGIC_4.aes');
  const output = stats.toJson({ source: true }).modules?.[0].modules?.[0].source;
  expect(output).to.include('export default class IdentityLogic4Contract extends Contract');
});

it('works with includes', async () => {
  const stats = await compiler('assets/Main.aes');
  const output = stats.toJson({ source: true }).modules?.[0].modules?.[0].source;
  expect(output).to.include('export default class MainContract extends Contract');
});

it('generates a proper class', async () => {
  expect(IdentityContract.prototype).to.be.instanceOf(Contract);
  // TODO: remove after resolving https://github.com/aeternity/aepp-sdk-js/issues/1713
  interface ContractFields {
    _aci: object;
    $options: {
      bytecode: string;
    };
  }
  [
    new IdentityContract({}),
    await IdentityContract.initialize({}),
  ].forEach((contract: ContractFields) => {
    expect(contract._aci).to.be.eql({
      encodedAci: {
        contract: {
          functions: [{
            arguments: [{
              name: 'x',
              type: 'int',
            }],
            name: 'getArg',
            payable: false,
            returns: 'int',
            stateful: false,
          }],
          kind: 'contract_main',
          name: 'Identity',
          payable: false,
          type_defs: [],
        },
      },
      externalEncodedAci: [],
      interface: 'main contract Identity =\n  entrypoint getArg : (int) => int\n',
    });
    expect(contract.$options.bytecode).to.be.equal(
      'cb_+GhGA6CnrCop0WHBS6ooHIsqMquYst202kMxRdF/vwCxqAv6rMC4O57+RNZEHwA3ADcAGg6CPwEDP/6AeCCSADcBBwcBAQCYLwIRRNZEHxFpbml0EYB4IJIZZ2V0QXJngi8AhTcuMC4xAMcrPgY=',
    );
  });
});
