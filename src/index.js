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
    .then(result => fs.writeFile(path.resolve(dir, generateName('resourceFile', url)), result.data))
    .catch(error => Promise.reject(error));


const loadResources = (urls, dir) =>
    fs.exists(dir)
    .then(() => log(`Load started \nDir: ${dir}`))
    .then((exists) => {
      if (!exists) fs.mkdir(dir);
    })
    .then(Promise.all(urls.map(url => loadResource(url, dir))))
    .then(() => log('Load finished'))
    .then(() => 'Ok')
    .catch(error => Promise.reject(error));


export default (pageURL, outputPath = '.') => {
  const pageName = path.resolve(outputPath, generateName('page', pageURL));
  const recourcesDir = path.resolve(outputPath, generateName('resourcesDir', pageURL));

  logApp(`Start app. \n  pageURL = ${pageURL} \n  outputPath = ${outputPath}`);

  return axios
    .get(pageURL)
    .then(result => result.data)
    .then((data) => {
      const links = parseLinks(data);
      const fullLinks = links.map(link => generateName('fullLink', pageURL, link));
      const localPageData = links.reduce((acc, link) =>
        acc.replace(link, generateName('localLink', recourcesDir, link)), data);
      return Promise.all([
        loadResources(fullLinks, recourcesDir),
        fs.writeFile(pageName, localPageData)]);
    })
    .then(() => `OK: Data was downloaded from ${pageURL} to ${pageName}\n`)

    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          return Promise.reject(`ERROR: File isn't found by url ${error.config.url}\n`);
        }
      } else if (error.code === 'ENOTFOUND') {
        return Promise.reject(`ERROR: Unable to connect to given URL: ${error.config.url}\n`);
      } else if (error.code === 'ECONNREFUSED') {
        return Promise.reject(`ERROR: Connection to ${error.address} refused by server\n`);
      } else if (error.code === 'ENOENT') {
        return Promise.reject(`ERROR: No such file or directory: ${error.path}\n`);
      }

      console.log(error);
      return Promise.reject(`ERROR: ${error.code}\n`);
    });
};
