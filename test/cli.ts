import { expect } from 'chai';
import genCommand from '../src/cli-command';

it('generates arguments for webpack', () => {
  let args: string[] = [];
  const command = genCommand(async (a) => {
    args = a;
    return Promise.resolve();
  });
  command.parse(['contracts/Main.aes'], { from: 'user' });
  expect(args[0]).to.satisfy((s: string) => s.endsWith('/node'));
  expect(args[1]).to.satisfy((s: string) => s.endsWith('/mocha'));
  expect(args[2]).to.be.equal('--config');
  expect(args[3]).to.satisfy((s: string) => s.endsWith('/webpack.config.js'));
  expect(args[4]).to.be.equal('--env');
  expect(args[5]).to.satisfy(
    (s: string) => s.startsWith('contracts=') && s.endsWith('/contracts/Main.aes'),
  );
  expect(args[7]).to.be.equal('--env');
  expect(args[8]).to.be.equal('compilerType=cli');
  expect(args[9]).to.be.equal('--env');
  expect(args[10]).to.be.equal('compilerUrl=https://v7.compiler.aepps.com/');
});

it('generates arguments for webpack to use http compiler', () => {
  let args: string[] = [];
  const command = genCommand(async (a) => {
    args = a;
    return Promise.resolve();
  });
  command.parse(
    [
      'contracts/Main.aes',
      'contracts/Foo',
      '--watch',
      '--compiler-type',
      'http',
      '--compiler-url',
      'http://example.com',
    ],
    { from: 'user' },
  );
  expect(args[0]).to.satisfy((s: string) => s.endsWith('/node'));
  expect(args[1]).to.satisfy((s: string) => s.endsWith('/mocha'));
  expect(args[2]).to.be.equal('--config');
  expect(args[3]).to.satisfy((s: string) => s.endsWith('/webpack.config.js'));
  expect(args[4]).to.be.equal('--env');
  const [prefix, paths] = args[5].split('=');
  const [path1, path2] = paths.split(',');
  expect(path1).to.satisfy((s: string) => s.endsWith('/contracts/Main.aes'));
  expect(path2).to.satisfy((s: string) => s.endsWith('/contracts/Foo'));
  expect(prefix).to.be.equal('contracts');
  expect(args[6]).to.be.equal('--watch');
  expect(args[7]).to.be.equal('--env');
  expect(args[8]).to.be.equal('compilerType=http');
  expect(args[9]).to.be.equal('--env');
  expect(args[10]).to.be.equal('compilerUrl=http://example.com');
});
