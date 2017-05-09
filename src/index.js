import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import generateName from './lib/url_formater';
import parseLinks from './lib/links_parser';
import resourcesLoad from './lib/resources_loader';


export default (url, outputPath = '.') => {
  const fileName = generateName('page', url);
  const dir = generateName(url, 'dir');
  const filePath = path.resolve(outputPath, fileName);

  return axios
    .get(url)
    .then(result => result.data)
    .then(data => fs.writeFile(filePath, data))
    // .then((data) => {
    //   const links = parseLinks(data);
    //   const localPageData = links.reduce((acc, link) =>
    //     acc.replace(link, generateName('localLink', dir, link)), data);
    //   fs.writeFile(filePath, localPageData);
    //   return links;
    // })
    // .then((links) => {
    //   const fullLinks = links.map(link => generateName('fullLink', url, link));
    //   resourcesLoad(fullLinks, dir);
    // })
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
