import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import generateName from './lib/file_name_generator';


export default (url, outputPath = '.') => {
  const fileName = generateName(url);
  const filePath = path.resolve(outputPath, fileName);

  return axios
    .get(url)
    .then(result => result.data)
    .then(data => fs.writeFile(filePath, data))
    .then(() => 'Ok')
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          return Promise.reject(`ERROR: File isn't found by url ${error.config.url}`);
        }
      }
      return Promise.reject(`ERROR: ${error.code}`);
    });
};
