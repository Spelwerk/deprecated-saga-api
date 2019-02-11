'use strict';

const bodyParser = require('body-parser');
const enforceNodePath = require('enforce-node-path');
const express = require('express');
const nconf = require('nconf');
const userAgent = require('express-useragent');

const logger = require('./src/logger/winston');
const initializers = require('./src/initializers');
const middlewares = require('./src/middlewares');

async function init() {
    const env = process.env.NODE_ENV || 'development';

    try {
        enforceNodePath(__dirname);

        const app = express();

        app.locals.ENV = env;
        app.locals.ENV_DEVELOPMENT = env === 'development';
        app.locals.PATH = process.env.NODE_PATH;

        initializers.mailGun.init(env);
        initializers.config.init(app);
        await initializers.database.init();

        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

        app.use(userAgent.express());

        middlewares.requestLog.init(app);
        middlewares.apiKeyAuth.init(app);
        middlewares.accountAuth.init(app);

        await initializers.routes.init(app);

        middlewares.onErrorResponse.init(app);
        middlewares.onRouteNotFoundResponse.init(app);

        logger.info(`[SERVER] listening on port: ${nconf.get('port')}`);

        app.listen(nconf.get('port'));
        logger.info(`[SERVER] init successful in ${env}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

void init();
