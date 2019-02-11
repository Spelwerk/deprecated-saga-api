'use strict';

const logger = require('../../logger/winston');
const passwordSQLHelper = require('./sql-helper-change-password');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const sendEmail = async (req, res, next) => {
    logger.debug('accounts/response-helper-password.sendEmail', req.log);

    try {
        await passwordSQLHelper.sendEmail(req.body.email);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const setNewPassword = async (req, res, next) => {
    logger.debug('accounts/response-helper-password.setNewPassword', req.log);

    try {
        await passwordSQLHelper.setNewPassword(req.body.email, req.body.secret, req.body.newPassword);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const setNewPasswordAsAdmin = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-email.setNewEmailAsAdmin', req.log);

    try {
        await passwordSQLHelper.setNewPasswordAsAdmin(accountId, req.account.id, req.body.newPassword);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    sendEmail,
    setNewPassword,
    setNewPasswordAsAdmin,
};
