'use strict';

const logger = require('../../logger/winston');
const verifySQLHelper = require('./sql-helper-verify');
const sessionSQLHelper = require('./sql-helper-session');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const sendEmail = async (req, res, next) => {
    logger.debug('accounts/sql-helper-verify.sendEmail', req.log);

    try {
        await verifySQLHelper.sendEmail(req.body.email);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const verifyAccount = async (req, res, next) => {
    logger.debug('accounts/sql-helper-verify.verifyAccount', req.log);

    const email = req.body.email;
    const secret = req.body.secret;
    const displayName = req.body.displayName;
    const password = req.body.password;

    try {
        const { id, refreshToken, uuid } = await verifySQLHelper.verifyAccount(email, secret, displayName, password, req.useragent);
        const { accessToken, session } = await sessionSQLHelper.getSession(uuid);

        res.status(200).send({ id, refreshToken, accessToken, session });
    } catch (err) {
        return next(err);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    sendEmail,
    verifyAccount,
};
