'use strict'
module.exports = {
    entry: [
        './src/assets/js/main.js'
    ],
    output: {
        publicPath: '/',
        filename: '[name].[hash].js'
    }
}