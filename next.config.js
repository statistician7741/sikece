/* eslint-disable */
const webpack = require('webpack')
const withLess = require('@zeit/next-less')
const withImages = require('next-images')
const withCSS = require('@zeit/next-css')

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}

module.exports = withCSS(withImages(withLess({
  cssModules: false,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  webpack: function (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    })
    return config
  }
})))