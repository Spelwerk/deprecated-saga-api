'use strict';

const logger = require('../../logger/winston');
const accountSQLHelper = require('./sql-helper-account');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next) => {
    logger.debug("response-helper-accounts.POST", req.log);

    try {
        const result = await accountSQLHelper.INSERT(req.body.email);
        res.status(201).send(result);
    } catch (err) {
        return next(err);
    }
};

const PUT = async (req, res, next, accountId) => {
    logger.debug("response-helper-accounts.PUT", req.log);

    try {
        await accountSQLHelper.UPDATE(accountId, req.account.id, req.body);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const DELETE = async (req, res, next, accountId) => {
    logger.debug("response-helper-accounts.DELETE", req.log);

    try {
        await accountSQLHelper.DELETE(accountId, req.account.id, req.account.roles);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const setDisplayName = async (req, res, next, accountId) => {
    logger.debug("response-helper-accounts.setDisplayName", req.log);

    try {
        await accountSQLHelper.setDisplayName(accountId, req.account.id, req.body.displayName);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    POST,
    PUT,
    DELETE,
    setDisplayName,
};
