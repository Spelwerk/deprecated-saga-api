'use strict';

const logger = require('../../logger/winston');
const refreshTokenSQLHelper = require('./sql-helper-refresh-token');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const GET = async (req, res, next) => {
    logger.debug('accounts/response-helper-tokens.GET', req.log);

    try {
        const results = await refreshTokenSQLHelper.getTokens(req.account.id);
        res.status(200).send({ results });
    } catch (err) {
        return next(err);
    }
};

const PUT = async (req, res, next, uuid) => {
    logger.debug('accounts/response-helper-tokens.PUT', req.log);

    try {
        await refreshTokenSQLHelper.setName(req.account.id, uuid, req.body.name);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const DELETE = async (req, res, next, uuid) => {
    logger.debug('accounts/response-helper-tokens.DELETE', req.log);

    try {
        await refreshTokenSQLHelper.revoke(req.account.id, uuid);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    GET,
    PUT,
    DELETE,
};
