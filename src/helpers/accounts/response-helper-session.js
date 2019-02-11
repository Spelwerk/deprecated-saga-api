'use strict';

const logger = require('../../logger/winston');
const sessionSQLHelper = require('./sql-helper-session');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const getSession = async (req, res, next) => {
    logger.debug('accounts/response-helper-session.getSession', req.log);

    try {
        const session = await sessionSQLHelper.getSession(req.tokens.refreshToken.uuid);
        res.status(200).send(session);
    } catch (err) {
        return next(err);
    }
};

const getInfo = async (req, res, next) => {
    logger.debug('accounts/response-helper-session.getInfo', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }
        res.status(200).send({ tokens: req.tokens });
    } catch (err) {
        return next(err);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    getSession,
    getInfo,
};
