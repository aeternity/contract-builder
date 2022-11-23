const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  configureWebpack: {
    module: {
      rules: [{
        test: /\.aes$/,
        use: {
          loader: path.resolve(__dirname, '../../dist/loader.js'),
        },
      }],
    },
  },
});
