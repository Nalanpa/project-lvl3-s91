import colors from 'colors'; // eslint-disable-line

export default (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        console.error(`${'ERROR:'.red} 404: File isn't found by url ${error.config.url.cyan}\n`);
        break;
      case 500:
        console.error(`${'ERROR:'.red} 500: Server is unavailable by url ${error.config.url.cyan}\n`);
        break;
      default:
        break;
    }
  } else if (error.code) {
    switch (error.code) {
      case 'ENOTFOUND':
        console.error(`${'ERROR:'.red} ${error.code}: Unable to connect to given URL: ${error.config.url.cyan}\n`);
        break;
      case 'ECONNREFUSED':
        console.error(`${'ERROR:'.red} ${error.code}: Connection to ${error.address.cyan} refused by server\n`);
        break;
      case 'ENOENT':
        console.error(`${'ERROR:'.red} ${error.code}: No such file or directory: ${error.path.cyan}\n`);
        break;
      default:
        break;
    }
  } else {
    console.error(error.message);
  }
};
