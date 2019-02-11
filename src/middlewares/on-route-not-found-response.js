'use strict';

const logger = require('../logger/winston');

const init = (app) => {
    logger.debug('[MIDDLEWARE] OnRouteNotFoundResponse init');

    app.use((req, res) => {
        res.status(404).send({ title: 'Route not found', details: 'The requested route could not be found.' });
    });

    logger.info('[MIDDLEWARE] OnRouteNotFoundResponse init success');
};

module.exports = {
    init,
};
