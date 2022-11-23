#!/usr/bin/env node
import runWebpackCli from 'webpack-cli/lib/bootstrap';
import genCommand from './cli-command';

genCommand(runWebpackCli as (args: string[]) => Promise<void>).parse();
