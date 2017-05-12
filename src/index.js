import fs from 'mz/fs';
import debug from 'debug';
import colors from 'colors'; // eslint-disable-line
import path from 'path';
import axios from './lib/axios';
import generateName from './lib/url_formater';
import parseLinks from './lib/links_parser';
import loadResources from './lib/load_resources';

// const logApp = debug('page-loader:app');
const log = debug('page-loader:index');


export default (pageURL, outputPath = '.', ctx = {}) => {
  // logApp(`Start app. \n  pageURL = ${pageURL} \n  outputPath = ${outputPath}`);
  ctx.res = 'begin';

  const pageName = path.resolve(outputPath, generateName('page', pageURL));
  const recourcesDir = path.resolve(outputPath, generateName('resourcesDir', pageURL));

  ctx.page = pageName;

  return fs.exists(outputPath)
    .then((exists) => {
      if (!exists) {
        return Promise.reject(new Error(`${'ERROR:'.red} Path not found: ${outputPath.cyan}\n`));
      }
      return Promise.resolve();
    })
    .then(() => axios.get(pageURL))
    .then(result => result.data)
    .then((data) => {
      log('in Data\n');
      const links = parseLinks(data);
      ctx.links = links;
      const fullLinks = links.map(link => generateName('fullLink', pageURL, link));
      const localPageData = links.reduce((acc, link) =>
        acc.replace(link, generateName('localLink', recourcesDir, link)), data);
      return Promise.all([
        loadResources(fullLinks, recourcesDir),
        fs.writeFile(pageName, localPageData)]);
    })
    .then(() => {
      log('Main finish\n'.magenta);
      ctx.res = `${'SUCCESS:'.green.bold} Data was downloaded from ${pageURL.cyan} to ${pageName.cyan}\n`;
      return ctx.res;
    })

    .catch((error) => {
      log('In CATCH'.red);
      if (error.response) {
        switch (error.response.status) {
          case 404:
            return Promise.reject(new Error(`${'ERROR:'.red} 404: File isn't found by url ${error.config.url.cyan}\n`));
          case 500:
            return Promise.reject(new Error(`${'ERROR:'.red} 500: Server is unavailable by url ${error.config.url.cyan}\n`));
          default:
            break;
        }
      } else {
        switch (error.code) {
          case 'ENOTFOUND':
            return Promise.reject(new Error(`${'ERROR:'.red} ${error.code}: Unable to connect to given URL: ${error.config.url.cyan}\n`));
          case 'ECONNREFUSED':
            return Promise.reject(new Error(`${'ERROR:'.red} ${error.code}: Connection to ${error.address.cyan} refused by server\n`));
          case 'ENOENT':
            return Promise.reject(new Error(`${'ERROR:'.red} ${error.code}: No such file or directory: ${error.path.cyan}\n`));
          default:
            break;
        }
      }
      return Promise.reject(new Error(error));
    });
};
