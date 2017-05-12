import fs from 'mz/fs';
// import debug from 'debug';
import os from 'os';
import Listr from 'listr';
import colors from 'colors'; // eslint-disable-line
import pageLoader from '../src';

// const log = debug('page-loader:test-spinner');

test('Test spinner', () => {
  const url = 'https://hexlet.io/courses';
  // const url = 'http://yandex.ru';
  const output = fs.mkdtempSync(`${os.tmpdir()}/`);

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
      // process.exit(1);
    });
});
