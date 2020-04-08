require('dotenv').config({path: './.env'});
const {body, validationResult} = require('express-validator');
const express = require('express'); 
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const https = require('https');
const helmet = require('helmet');
const {
    AUTH_PORT,
    CAPTCHA_SECRET,
    CAPTCHA_KEY,
    SSL_CERT,
    SSL_KEY,
    SSL_PW
} = process.env;
const app = express();
app.use(helmet);
app.use(cors);
app.use(express.json());

app.post('/auth', (req, res) => {
    res.send('Heey');
});

const sslOptions = {
    key: SSL_CERT,
    secret: SSL_KEY,
    passphrase: SSL_PW
};

const httpsServer = https.createServer(sslOptions, app);

const listener = httpsServer.listen(AUTH_PORT, () => console.log(`Secure server connected on ${listener.address().port}`));