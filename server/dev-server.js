require('dotenv').config({path: './.env'});
const express = require('express');
const app = express();
const WebpackDevMiddleware = require('webpack-dev-middleware');
const https = require('https');
const fs = require('fs');
const config = require('../webpack.dev');
const helmet = require('helmet');
const webpack = require('webpack');
const compiler = webpack(config);
const {
    SSL_CERT,
    SSL_KEY,
    SSL_PW,
    PORT
} = process.env;

const httpsOptions = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT),
    passphrase: SSL_PW
};

const secureServer = https.createServer(httpsOptions, app);

app.use(helmet());

app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

require('./routes/routes')(app, compiler);

const listener = secureServer.listen(PORT, () => console.log(`Connected on ${listener.address().port}`));