'use strict';

const logger = require('../logger/winston');
const UUID = require('uuid/v4');

const init = (app) => {
    logger.debug('[MIDDLEWARE] RequestLog init');

    app.use((req, res, next) => {
        req.useragent.remoteAddress = req.connection.remoteAddress;

        req.log = {
            id: UUID(),
            host: req.headers['host'],
            userAgent: req.useragent,
            method: req.method,
            url: req.url,
            body: {},
        };

        for (let key in req.body) {
            if (key === 'password') continue;
            if (key === 'secret') continue;

            req.log.body[key] = req.body[key];
        }

        logger.debug(req.log);

        next();
    });

    logger.info('[MIDDLEWARE] RequestLog init success');
};

module.exports = {
    init,
};
