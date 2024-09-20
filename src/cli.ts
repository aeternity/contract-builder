#!/usr/bin/env node
import runWebpackCli from 'webpack-cli/lib/bootstrap.js';
import genCommand from './cli-command.js';

genCommand(runWebpackCli as (args: string[]) => Promise<void>).parse();
