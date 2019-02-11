'use strict';

const logger = require('../logger/winston');

const init = (app) => {
    logger.debug('[MIDDLEWARE] OnErrorResponse init');

    app.use((err, req, res, next) => {
        if (!err) {
            return next();
        }

        err.uuid = req.log.id;
        err.status = err.status || 500;
        err.name = err.name || 'Error';
        err.title = err.title || 'Error';
        err.details = err.details || 'An error has occured on the server';
        err.message = err.message || null;

        req.log.error = err;

        console.error(err);
        logger.error(req.log);

        res.status(err.status).send(err);
    });

    logger.info('[MIDDLEWARE] OnErrorResponse init success');
};

module.exports = {
    init,
};
