#!/usr/bin/env node
import program from 'commander';
import colors from 'colors'; // eslint-disable-line
import pageLoader from '../';
import pjson from '../../package.json';
// import debug from 'debug';

// const log = debug('page-loader:bin');

program
  .version(pjson.version)
  .description('Download page to given location')
  .arguments('<url>')
  .option('-o, --output [path_to_save]', 'Path to save files')
  .action((url, { output = './' }) => {
    pageLoader(url, output)
      .then(res => process.exit(res))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  })
  .parse(process.argv);

if (!program.args.length) program.help();
