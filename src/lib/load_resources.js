import fs from 'mz/fs';
import path from 'path';
import debug from 'debug';
import axios from './axios';
import generateName from './url_formater';
import colors from 'colors'; // eslint-disable-line

const log = debug('page-loader:load_resources');

const loadResource = (url, dir) =>
    axios.get(url, { responseType: 'arraybuffer' })
    .then(result => fs.writeFile(path.resolve(dir, generateName('resourceFile', url)), result.data))
    .catch((error) => {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            return Promise.resolve(`${'Error:'.yellow} 404: File isn't found by url ${error.config.url.yellow}`);
          case 400:
            return Promise.resolve(`${'Error:'.yellow} 400: Bad request: ${error.response.config.url.yellow}`);
          default:
            log(error);
            return Promise.resolve(`Error.status: ${error.response.status}`);
        }
      } else if (error.code) {
        switch (error.code) {
          case 'ENAMETOOLONG':
            return Promise.resolve(`${'Error:'.yellow} ENAMETOOLONG : Name of resource file is too long `);
          default:
            log(error);
            return Promise.resolve(`Error.code: ${error.code}`);
        }
      } else {
        return Promise.resolve('UNKNOWN ERROR!!!');
      }
    });


export default (urls, dir) =>
    fs.exists(dir)
    .then((exists) => {
      if (!exists) {
        return fs.mkdir(dir);
      }
      return Promise.resolve();
    })
    .then(() => Promise.all(urls.map(url => loadResource(url, dir))));
