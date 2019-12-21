'use strict'
module.exports = {
    entry: {
        index: './src/assets/js/main.js'
    },
    output: {
        publicPath: '/',
        filename: '[name].[hash].js'
    }
}