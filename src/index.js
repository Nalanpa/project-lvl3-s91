import fs from 'mz/fs';
import debug from 'debug';
import path from 'path';
import axios from './lib/axios';
import generateName from './lib/url_formater';
import parseLinks from './lib/links_parser';


const logApp = debug('page-loader:app');
const log = debug('page-loader:load');


const loadResource = (url, dir) =>
    axios.get(url, { responseType: 'arraybuffer' })
    .then(result => fs.writeFile(path.resolve(dir, generateName('resourceFile', url)), result.data));


const loadResources = (urls, dir) =>
    fs.exists(dir)
    .then((exists) => {
      if (!exists) {
        return fs.mkdir(dir);
      }
      return Promise.resolve();
    })
    .then(() => log(`Load resources started \nDir: ${dir}`))
    .then(Promise.all(urls.map(url => loadResource(url, dir))))
    .then(() => log('Load resources finished'))
    .then(() => 'Ok');


export default (pageURL, outputPath = '.', ctx = {}) => {
  logApp(`Start app. \n  pageURL = ${pageURL} \n  outputPath = ${outputPath}`);

  const pageName = path.resolve(outputPath, generateName('page', pageURL));
  const recourcesDir = path.resolve(outputPath, generateName('resourcesDir', pageURL));

  ctx.page = pageName;

  return fs.exists(outputPath)
    .then((exists) => {
      if (!exists) {
        return Promise.reject(new Error(`ERROR: Path not found: ${outputPath}\n`));
      }
      return Promise.resolve();
    })
    .then(() => axios.get(pageURL))
    .then(result => result.data)
    .then((data) => {
      log('in Data');
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
      ctx.res = `OK: Data was downloaded from ${pageURL} to ${pageName}\n`;
      return ctx.res;
    })

    .catch((error) => {
      log('In CATCH', error);
      if (error.response) {
        switch (error.response.status) {
          case 404:
            return Promise.reject(new Error(`ERROR: 404: File isn't found by url ${error.config.url}\n`));
          case 500:
            return Promise.reject(new Error(`ERROR: 500: Server is unavailable by url ${error.config.url}\n`));
          default:
            break;
        }
      } else {
        switch (error.code) {
          case 'ENOTFOUND':
            return Promise.reject(new Error(`ERROR: ${error.code}: Unable to connect to given URL: ${error.config.url}\n`));
          case 'ECONNREFUSED':
            return Promise.reject(new Error(`ERROR: ${error.code}: Connection to ${error.address} refused by server\n`));
          case 'ENOENT':
            return Promise.reject(new Error(`ERROR: ${error.code}: No such file or directory: ${error.path}\n`));
          default:
            break;
        }
      }
      return Promise.reject(new Error(error));
    });
};
