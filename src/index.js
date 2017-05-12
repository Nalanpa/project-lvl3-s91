import fs from 'mz/fs';
import colors from 'colors'; // eslint-disable-line
import path from 'path';
import Listr from 'listr';
import axios from './lib/axios';
import generateName from './lib/url_formater';
import parseLinks from './lib/links_parser';
import loadResources from './lib/load_resources';
import outputError from './lib/output_error';
// import debug from 'debug';

// const log = debug('page-loader:index');


export default (pageURL, outputPath = '.') => {
  const pageName = path.resolve(outputPath, generateName('page', pageURL));
  const recourcesDir = path.resolve(outputPath, generateName('resourcesDir', pageURL));

  const tasks = new Listr([
    {
      title: 'Output path checking',
      task: () =>
        fs.exists(outputPath)
        .then((exists) => {
          if (!exists) {
            return Promise.reject(new Error(`${'ERROR:'.red} Path not found: ${outputPath.cyan}\n`));
          }
          return Promise.resolve();
        }),
    },
    {
      title: 'Main page loading',
      task: ctx =>
        axios.get(pageURL)
        .then((result) => {
          ctx.data = result.data;
        }),
    },
    {
      title: 'Resources loading',
      task: (ctx) => {
        const data = ctx.data;
        const links = parseLinks(data);
        const fullLinks = links.map(link => generateName('fullLink', pageURL, link));
        const localPageData = links.reduce((acc, link) =>
          acc.replace(link, generateName('localLink', recourcesDir, link)), data);
        return Promise.all([
          loadResources(fullLinks, recourcesDir),
          fs.writeFile(pageName, localPageData)]);
      },
    },
  ]);

  return tasks.run()
    .then(() => {
      console.log(`${'SUCCESS:'.green.bold} Data was downloaded from ${pageURL.cyan} to ${pageName.cyan}\n`);
      return 0;
    })
    .catch((error) => {
      outputError(error);
      return Promise.reject(1);
    });
};
