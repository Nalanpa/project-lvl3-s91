
const nameWOExtention = url => `${url.split(/[^A-Z, a-z, 0-9]/g).filter(e => e).slice(1).join('-')}`;

const page = url => `${nameWOExtention(url)}.html`;
const dir = url => `${nameWOExtention(url)}_files`;

const types = { page, dir };

export default (link, type) => (types[type] ? types[type](link) :
  'Unknown type of name generator');
