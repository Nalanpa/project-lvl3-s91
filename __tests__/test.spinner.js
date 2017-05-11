import fs from 'mz/fs';
import os from 'os';
import Listr from 'listr';
import colors from 'colors'; // eslint-disable-line
import pageLoader from '../src';

test('Test spinner', () => {
  const url = 'https://hexlet.io/courses';
  // const output = './tmp';
  const output = fs.mkdtempSync(`${os.tmpdir()}/`);

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
    .then(ctx => console.log(ctx.res.green))
    .catch((err) => {
      console.error(err.message.red);
      process.exit(1);
    });
});
