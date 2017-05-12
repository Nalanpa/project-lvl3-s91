import cheerio from 'cheerio';
import _ from 'lodash';

const attributes = {
  link: 'href',
  script: 'src',
  img: 'src',
};

export default (data) => {
  const $ = cheerio.load(data);
  const urls = _.flatMap(['link', 'script', 'img'], item =>
    $(item).map((i, el) => $(el).attr(attributes[item])).get().filter(Boolean));
  return urls;
};
