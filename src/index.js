import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import generateName from './lib/name_generator';
import parseLinks from './lib/links_parser';
import formatLink from './lib/links_formatter';


export default (url, outputPath = '.') => {
  const fileName = generateName(url, 'page');
  const filePath = path.resolve(outputPath, fileName);

  return axios
    .get(url)
    .then(result => result.data)
    // .then((data) => {
    //   const links = parseLinks(data);
    //   const fullLinks = links.map(link => formatLink(link, url));
    //   const page = links.reduce((acc, link) =>
    //     acc.replace(link, `${filesDir}${path.sep}${getNameFromUrl(link)}`), data);
    // })
    .then(data => fs.writeFile(filePath, data))
    .then(() => `OK: Data was downloaded from ${url} to ${filePath}\n`)
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
