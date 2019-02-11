'use strict';

const logger = require('../../logger/winston');
const existsSQLHelper = require('./sql-helper-exists');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const displayNameExists = async (req, res, next, displayName) => {
    logger.debug('accounts/sql-helper-roles.getRoles');

    try {
        const result = await existsSQLHelper.displayNameExists(displayName);
        res.status(200).send({ exists: result });
    } catch (err) {
        return next(err);
    }
};

const emailExists = async (req, res, next, email) => {
    logger.debug('accounts/sql-helper-roles.getRoles');

    try {
        const result = await existsSQLHelper.emailExists(email);
        res.status(200).send({ exists: result });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    displayNameExists,
    emailExists,
};
