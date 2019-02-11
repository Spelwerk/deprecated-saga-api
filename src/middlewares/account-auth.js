'use strict';

const logger = require('../logger/winston');
const { jwt } = require('../utils');
const { TokenKey } = require('../constants');

const init = (app) => {
    logger.debug('[MIDDLEWARE] AccountAuth init');

    app.use((req, res, next) => {
        req.account = {
            id: null,
            roles: {},
        };

        req.tokens = {
            accessToken: {},
            refreshToken: {},
        };

        try {
            const accessToken = req.headers[TokenKey.ACCESS] || null;
            const refreshToken = req.headers[TokenKey.REFRESH] || null;

            if (accessToken) {
                req.tokens.accessToken = jwt.decodeToken(accessToken);

                req.account.id = req.tokens.accessToken.account.id;
                req.account.roles = req.tokens.accessToken.account.roles;
            }

            if (refreshToken) {
                req.tokens.refreshToken = jwt.decodeToken(refreshToken);
            }
        } catch (e) {
            return next(e);
        }

        next();
    });

    logger.info('[MIDDLEWARE] AccountAuth init success');
};

module.exports = {
    init,
};
