import fs from 'mz/fs';
import debug from 'debug';
import os from 'os';
import Listr from 'listr';
import colors from 'colors'; // eslint-disable-line
import pageLoader from '../src';

const log = debug('page-loader:test-spinner');

test('Test spinner', () => {
  const url = 'https://hexlet.io/coursesd';
  // const url = 'http://yandex.ru';
  // const output = './tmp';
  const output = fs.mkdtempSync(`${os.tmpdir()}/`);

  const tasks = new Listr([
    {
      title: 'Page loading'.cyan,
      task: ctx =>
        pageLoader(url, output, ctx)
          .then(() => log('0...'.green))
          // .then(() => new Listr([
          //   {
          //     title: 'First'.cyan,
          //     task: () => console.log((` ${'✔'.green}  Page1  is ready\n`)),
          //     // title: 'Loading page'.cyan,
          //     // task: () => console.log((` ${'✔'.green}  Page ${ctx.page} is ready\n`)),
          //   },
          //   {
          //     title: 'Second'.cyan,
          //     task: () => console.log((` ${'✔'.green}  Page2  is ready\n`)),
          //     // title: 'Loading files'.cyan,
          //     // task: () => ctx.links.forEach(link =>
          //     //   console.log((` ${'✔'.green}  File ${link} is ready`))),
          //   },
          // ]))
          // .then(console.log('1000...'))
          .catch((err) => {
            log('In task catch'.red);
            return Promise.reject(new Error(err.message));
          }),
    },

  ]);


  return tasks.run()
    .then(ctx => console.log(ctx.res))
    .catch((err) => {
      log('In taskS cathc'.red, err.message);
      console.error(err.message.red);
      // process.exit(1);
    });
});
