/* global require console */
const express = require('express');
const config = require('../webpack.dev');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.get('/offers', (req, res) => {
    compiler.outputFileSystem.readFile('/Users/paulsingh/Dev/Projects/princeofindia/dist/offers.html', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.set('content-type', 'text/html')
            res.send(result)
            res.end()
        }
    });
})

app.listen(3000, () => console.log('Connected on port 3000'));