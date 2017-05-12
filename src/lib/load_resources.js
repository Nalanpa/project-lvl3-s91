import fs from 'mz/fs';
import debug from 'debug';
import path from 'path';
import axios from './axios';
import generateName from './url_formater';
import colors from 'colors'; // eslint-disable-line

const log = debug('page-loader:load_resources');
const logr = debug('page-loader:load_resource');

const loadResource = (url, dir) => {
  return axios.get(url, { responseType: 'arraybuffer' })
    .then((response) => {
      // logr(`Url: ${url} loaded by axios`); // // //
      return response;
    })
    .then(result => fs.writeFile(path.resolve(dir, generateName('resourceFile', url)), result.data))
    // .then(() => logr(`Url: ${url} writed to file`)) // // //
    .catch((error) => {
      logr(`${'Error catched'.red}. URL: ${url}`); // // //
      if (error.response) {
        switch (error.response.status) {
          case 404:
            console.log(`${'ERROR:'.yellow} 404: File isn't found by url ${error.config.url.cyan}\n`);
            break;
          case 400:
            console.log(`${'ERROR:'.yellow} 400: Bad request: ${error.response.config.url.cyan}\n`);
            break;
          default:
            console.error(`ERROR.response.status: ${error.response.status}\n`);
            break;
        }
      } else if (error.code) {
        switch (error.code) {
          case 'ENAMETOOLONG':
            console.log(`${'ERROR:'.yellow} ENAMETOOLONG : Name of resource file is too long \n`);
            break;
          default:
            console.error(`ERROR.code: ${error.code}\n`);
            break;
        }
      } else {
        console.error('UNKNOWN ERROR!!!');
      }
      // logr('End of catch'.red); // // //
      // return Promise.reject('!!! 111 !!!'.red);
    });
};


export default (urls, dir) =>
    fs.exists(dir)
    .then((exists) => {
      log('Begin load resources\n'); // // //
      if (!exists) {
        return fs.mkdir(dir);
      }
      return Promise.resolve();
    })
    .then(() => Promise.all(urls.map(url => loadResource(url, dir))))
    .then(() => log('All resources downloaded\n')) // // //
    .catch(error => log(error)); // // //
