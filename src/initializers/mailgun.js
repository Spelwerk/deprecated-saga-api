'use strict';

const { readSync } = require('node-yaml');
const logger = require('../logger/winston');
const config = readSync('../../config/mailgun.yml');

let mailgun;
let isProduction;

const init = (environment) => {
    logger.debug('[MAILGUN] init');

    isProduction = environment === 'production';

    mailgun = require('mailgun-js')(config);

    logger.info('[MAILGUN] init success');
};

const getMailgun = () => {
    return mailgun;
};

const shouldSendEmail = () => {
    return isProduction;
};

module.exports = {
    init,
    getMailgun,
    shouldSendEmail,
};
