'use strict';

const nconf = require('nconf');
const logger = require('../logger/winston');

const init = (app) => {
    logger.debug('[CONFIG] init');

    const PATH = app.locals.PATH;
    const ENV = app.locals.ENV;

    require('dotenv').load();
    nconf.file({file: `${PATH}/config/${ENV}.yml`, format: require('nconf-yaml')});
    nconf.env();
    nconf.argv();

    logger.info('[CONFIG] init success');
};

module.exports = {
    init,
};
