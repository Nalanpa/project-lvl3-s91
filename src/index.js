// import axios from './lib/axios';

export default (url, output = '.') => {
  const message = `Url: ${url}, output: ${output}`;
  return new Promise((resolve) => {
    resolve(message);
  });
};
