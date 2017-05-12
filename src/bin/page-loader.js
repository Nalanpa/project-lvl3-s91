#!/usr/bin/env node
import Listr from 'listr';
import program from 'commander';
// import debug from 'debug';
import colors from 'colors'; // eslint-disable-line
import pageLoader from '../';
import pjson from '../../package.json';

// const log = debug('page-loader:bin');

program
  .version(pjson.version)
  .description('Download page to given location')
  .arguments('<url>')
  .option('-o, --output [path_to_save]', 'Path to save files')
  .action((url, { output = './' }) => {
    const tasks = new Listr([
      {
        title: 'Page loading'.cyan,
        task: ctx =>
          pageLoader(url, output, ctx)
            .catch(err => Promise.reject(new Error(err.message))),
      },
    ]);

    return tasks.run()
      .then(ctx => console.log(ctx.res))
      .catch((err) => {
        console.error(err.message.red);
        process.exit(1);
      });
  })
  .parse(process.argv);

if (!program.args.length) program.help();
