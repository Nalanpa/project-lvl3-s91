import fs from 'mz/fs';
// import debug from 'debug';
import path from 'path';
import axios from './axios';
import generateName from './url_formater';
import colors from 'colors'; // eslint-disable-line

// const log = debug('page-loader:load_resources');
// const logr = debug('page-loader:load_resource');

const loadResource = (url, dir) =>
    axios.get(url, { responseType: 'arraybuffer' })
    .then(result => fs.writeFile(path.resolve(dir, generateName('resourceFile', url)), result.data))
    .catch((error) => {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            console.error(`${'ERROR:'.yellow} 404: File isn't found by url ${error.config.url.cyan}\n`);
            break;
          case 400:
            console.error(`${'ERROR:'.yellow} 400: Bad request: ${error.response.config.url.cyan}\n`);
            break;
          default:
            console.error(`ERROR.response.status: ${error.response.status}\n`);
            break;
        }
      } else if (error.code) {
        switch (error.code) {
          case 'ENAMETOOLONG':
            console.error(`${'ERROR:'.yellow} ENAMETOOLONG : Name of resource file is too long \n`);
            break;
          default:
            console.error(`ERROR.code: ${error.code}\n`);
            break;
        }
      } else {
        console.error('UNKNOWN ERROR!!!');
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
