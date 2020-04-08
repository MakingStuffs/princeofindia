/* global require console */
const express = require('express');
const config = require('../webpack.dev');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

require('./routes/routes')(app, compiler);

app.listen(3000, () => console.log('Connected on port 3000'));