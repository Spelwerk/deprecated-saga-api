'use strict';

const logger = require('../../logger/winston');
const { SELECT } = require('../common/sql-helper');
const roleSQLHelper = require('./sql-helper-role');
const { jwt, validator } = require('../../utils');

const AccountNotFoundError = require('../../errors/account-not-found-error');
const AccountInvalidTokenError = require('../../errors/account-invalid-token-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const getSession = async (uuid) => {
    logger.debug('accounts/response-sql-session.getSession');

    const refreshRows = await SELECT('account_token', ['account_id'], { uuid });

    if (!refreshRows || !refreshRows.length) {
        throw new AccountInvalidTokenError;
    }

    const id = parseInt(refreshRows[0].account_id);
    const accountRows = await SELECT('account', ['id'], { id, deleted: false });

    if (!accountRows || !accountRows.length) {
        throw new AccountNotFoundError;
    }

    const roles = await roleSQLHelper.SELECT(id);
    const accountDetails = { id, roles };
    const { accessToken, expiry } = jwt.encodeAccessToken(accountDetails);

    return { accessToken, session: { expiry, id, roles } };
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    getSession,
};
