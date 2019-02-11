'use strict';

const nconf = require('nconf');
const basicAuth = require('basic-auth');

const logger = require('../logger/winston');

const MissingCredentialsError = require('../errors/app-missing-credentials-error');
const InvalidCredentialsError = require('../errors/app-invalid-credentials-error');

const init = (app) => {
    logger.debug('[MIDDLEWARE] HeaderAuth init');

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        next();
    });

    app.use((req, res, next) => {
        const credentials = basicAuth(req);
        const keyId = nconf.get('apiKey:id');
        const keySecret = nconf.get('apiKey:secret');

        if (!credentials) {
            return next(new MissingCredentialsError);
        }

        if (credentials.name !== keyId || credentials.pass !== keySecret) {
            return next(new InvalidCredentialsError);
        }

        next();
    });

    logger.info('[MIDDLEWARE] HeaderAuth init success');
};

module.exports = {
    init,
};
