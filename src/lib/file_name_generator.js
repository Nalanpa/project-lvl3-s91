
const nameWOExtention = url => `${url.split(/[^A-Z, a-z, 0-9]/g).filter(e => e).slice(1).join('-')}`;

const file = url => `${nameWOExtention(url)}.html`;
const folder = url => `${nameWOExtention(url)}_files`;

const types = { file, folder };

export default (link, type) => (!types[type] ?
  'Unknown type of name generator' : types[type](link));
