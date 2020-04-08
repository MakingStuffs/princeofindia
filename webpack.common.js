'use strict';
module.exports = {
    entry: [
        '@babel/polyfill'
    ],
    output: {
        publicPath: '/',
        filename: '[name].[hash].js'
    }
};