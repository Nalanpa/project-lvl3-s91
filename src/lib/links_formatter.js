import url from 'url';
// import parseLinks from './links_parser';
// import nameGenerate from './name_generator';

export default (link, pageURL) => {
  const { protocol, host } = url.parse(pageURL);
  const { hostname } = url.parse(link);
  return hostname === null ? url.format({ protocol, host, pathname: link }) : link;
};

// export default (data, pageURL) => {
//   const links = parseLinks(data);
//   const fullLinks = links.map(link => formatLink(link, pageURL));
//   const filesDir = nameGenerate(pageURL, 'dir');
//
//
//   return fullLinks;
// };
