const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        $scss: path.resolve('src/assets/styles'),
      },
    },
  },
};
