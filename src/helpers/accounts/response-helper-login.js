'use strict';

const logger = require('../../logger/winston');
const loginSQLHelper = require('./sql-helper-login');
const sessionSQLHelper = require('./sql-helper-session');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const sendEmail = async (req, res, next) => {
    logger.debug('accounts/sql-helper-login.sendEmail', req.log);

    try {
        await loginSQLHelper.sendEmail(req.body.email);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const validateLoginSecret = async (req, res, next) => {
    logger.debug('accounts/sql-helper-login.validateLoginSecret', req.log);

    try {
        const { refreshToken, uuid } = await loginSQLHelper.validateLoginSecret(req.body.email, req.body.secret, req.useragent);
        const { accessToken, session } = await sessionSQLHelper.getSession(uuid);

        res.status(200).send({ refreshToken, accessToken, session });
    } catch (err) {
        return next(err);
    }
};

const withPassword = async (req, res, next) => {
    logger.debug('accounts/sql-helper-login.withPassword', req.log);

    try {
        const { refreshToken, uuid } = await loginSQLHelper.withPassword(req.body.email, req.body.password, req.body.token, req.useragent);
        const { accessToken, session } = await sessionSQLHelper.getSession(uuid);

        res.status(200).send({ refreshToken, accessToken, session });
    } catch (err) {
        return next(err);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    sendEmail,
    validateLoginSecret,
    withPassword,
};
