#!/usr/bin/env node
import Listr from 'listr';
import program from 'commander';
import colors from 'colors'; // eslint-disable-line
import pageLoader from '../';
import pjson from '../../package.json';


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
            .catch((err) => {
              Promise.reject(new Error(err.message));
            }),
      },

    ]);


    return tasks.run()
      .then(ctx => console.log(ctx.res))
      .catch((err) => {
        console.error(err.message.red);
        process.exit(1);
      });


    // const tasks = new Listr([
    //   {
    //     title: `Saving page ${url}`.green,
    //     task: () =>
    //       new Listr([
    //         {
    //           title: 'Uploading'.cyan,
    //           task: ctx =>
    //             pageLoader(url, output, ctx)
    //               .then(res => (ctx.res = res))
    //               .then(() => new Listr([
    //                 {
    //                   title: 'Loading page'.cyan,
    //                   task: () => console.log((` ${'✔'.green}  Page ${ctx.page} is ready\n`)),
    //                 },
    //                 {
    //                   title: 'Loading files'.cyan,
    //                   task: () => ctx.links.forEach(link =>
    //                     console.log((` ${'✔'.green}  File ${link} is ready`))),
    //                 },
    //               ])),
    //         },
    //
    //       ]),
    //   },
    // ]);
    //
    //
    // return tasks.run()
    //   .catch((err) => {
    //     console.error(err.message.red);
    //     process.exit(1);
    //   });
    // pageLoader(url, program.output)
    //   .then(res => console.log(res))
    //   .catch((error) => {
    //     console.error(error);
    //     process.exit(1);
    //   });
  })
  .parse(process.argv);

if (!program.args.length) program.help();
