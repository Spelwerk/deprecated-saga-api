'use strict';

const logger = require('../../logger/winston');
const otpSQLHelper = require('./sql-helper-otp');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-otp.GET');

    try {
        const result = await otpSQLHelper.INSERT(accountId);
        res.status(200).send(result);
    } catch (err) {
        return next(err);
    }
};

const DELETE = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-otp.DELETE', req.log);

    try {
        await otpSQLHelper.DELETE(accountId, req.account.id);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const verify = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-otp.verify', req.log);

    try {
        await otpSQLHelper.verify(accountId, req.body.token);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    POST,
    DELETE,
    verify,
};
