'use static';

const logger = require('../../logger/winston');
const emailSQLHelper = require('./sql-helper-change-email');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const sendEmail = async (req, res, next) => {
    logger.debug('accounts/sql-helper-email.sendEmail', req.log);

    try {
        await emailSQLHelper.sendEmail(req.body.email);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const setNewEmail = async (req, res, next) => {
    logger.debug('accounts/sql-helper-email.setNewEmail', req.log);

    try {
        await emailSQLHelper.setNewEmail(req.body.email, req.body.secret, req.body.newEmail);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const setNewEmailAsAdmin = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-email.setNewEmailAsAdmin', req.log);

    try {
        await emailSQLHelper.setNewEmailAsAdmin(accountId, req.account.id, req.body.newEmail);
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
    setNewEmail,
    setNewEmailAsAdmin,
};
