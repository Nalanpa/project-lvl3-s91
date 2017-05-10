import url from 'url';
import path from 'path';

const formatPath = address => address.split(/[^A-Z, a-z, 0-9]/g).filter(e => e).join('-');

const nameWOExtention = (urlPath) => {
  const urlObj = url.parse(urlPath);
  const pathObj = path.parse(urlObj.path);
  const res1 = formatPath(urlObj.host + pathObj.dir);
  return pathObj.name ? `${res1}-${pathObj.name}` : res1;
};

const page = urlPath => `${nameWOExtention(urlPath)}.html`;

const resourcesDir = urlPath => `${nameWOExtention(urlPath)}_files`;

const fullLink = (pageURL, link) => {
  const { protocol, host } = url.parse(pageURL);
  const { hostname } = url.parse(link);
  return hostname === null ? url.format({ protocol, host, pathname: link }) : link;
};

const resourceFile = (link) => {
  const urlPath = url.parse(link).path;
  const pathObj = path.parse(urlPath);
  const fullPath = `${pathObj.dir}/${pathObj.name}`;
  return `${formatPath(fullPath)}${pathObj.ext}`;
};

const localLink = (dir, link) => `${dir}/${resourceFile(link)}`;

const types = { page, resourcesDir, resourceFile, fullLink, localLink, nameWOExtention };

export default (type, address, link) => (types[type] ? types[type](address, link) :
  'Unknown type of URL formatter');
