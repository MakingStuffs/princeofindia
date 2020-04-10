require('dotenv').config({
    path: './process.env'
});
const {
    body,
    validationResult,
} = require('express-validator');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const app = express();

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"]
    }
}));
app.use(cors());
app.use(express.json());

const {
    CAPTCHA_PORT,
    SSL_KEY,
    SSL_CERT,
    SSL_PW
} = process.env;

app.post('/send-booking', [
    // First name
    body('firstName')
    .isLength({
        min: 3
    })
    .withMessage('Your first name needs to be at least 3 letters')
    .matches(/^[a-zA-Z-]+$/i)
    .withMessage('Your first name can only contain letters and hyphens')
    .trim().escape(),
    // Second Name
    body('lastName')
    .isLength({
        min: 3
    })
    .withMessage('Your last name needs to be at least 3 letters')
    .matches(/^[a-zA-Z-]+$/i)
    .withMessage('Your last name can only contain letters and hyphens')
    .trim().escape(),
    // Date
    body('date')
    .matches(/^(((0)[0-9])|((1)[0-2]))(\/)([0-2][0-9]|(3)[0-1])(\/)\d{4}$/)
    .withMessage('The date you entered does not seem to be correct. It should follow the following patter DD/MM/YYYY'),
    // Time
    body('time')
    .matches(/^(((0)[0-9])|((1)[0-9])|((2)[0-3]))(:)((([0-5])[0-9]))$/)
    .withMessage('The time you entered doesn\'t seem to be correct. It should be in 24 hour format. For example 14:00.'),
    // Phone
    body('phone')
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    .withMessage('Your phone number does not seem to be valid'),
    // Email
    body('email')
    .isEmail()
    .withMessage('You seem to have entered an invalid email address'),
    // Count
    body('headCount')
    .isNumeric()
    .withMessage('It seems like you have entered something other than a number for your party\'s size')
], (req, res) => {
    const {
        date,
        captchaCheck,
        captcha
    } = req.body;

    let reply = {},
        errors = [];
    const valResult = validationResult(req);
    console.log(req.body);
    if (valResult.errors[0]) {
        for (let err of valResult.errors) {
            let errObj = {
                value: err.value,
                field: err.param,
                msg: err.msg
            };
            errors.push(errObj);
        }
        reply.status = 'error';
        reply.errors = errors;
        return res.send(reply);
    } else if (new Date(date) < new Date()) {
        reply.status = 'error';
        reply.errors = [{
            value: date,
            field: 'date',
            msg: 'Sorry you cannot book a table in the past.'
        }];
        return res.send(reply);
    } else if (captcha.toLowerCase() !== captchaCheck.letter.toLowerCase() ||
        req.body[captchaCheck.field][captchaCheck.index].toLowerCase() !== captcha.toLowerCase()) {
        reply.status = 'error';
        reply.errors = [{
            field: 'captcha',
            msg: 'You appear to have failed the captcha check, are you a robot?',
            value: captcha
        }];
        return res.send(reply);
    } else {
        reply.status = 'success';
        reply.msg = 'Thanks for getting in touch, you will receive a confirmation shortly.';
        return res.send(reply);
    }
});

const sslOptions = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT),
    passphrase: SSL_PW
};

const httpsServer = https.createServer(sslOptions, app);

const listener = httpsServer.listen(CAPTCHA_PORT || 5000, () => console.log('Connected on port ' + listener.address().port));