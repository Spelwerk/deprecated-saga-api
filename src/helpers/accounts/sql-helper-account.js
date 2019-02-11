'use strict';

const dateFns = require('date-fns');

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const roleSQLHelper = require('./sql-helper-role');
const otpSQLHelper = require('./sql-helper-otp');
const { encryption, mailer, randomHash, testTools, validator } = require('../../utils');
const { displayNameExists, emailExists } = require('./sql-helper-exists');
const { AccountRoleType, DateFormat, Expiry } = require('../../constants');
const emailTemplates = require('../../templates/emails');

const AccountNotFoundError = require('../../errors/account-not-found-error');
const AccountDisplayNameExistsError = require('../../errors/account-display-name-exists-error');
const AccountEmailExistsError = require('../../errors/account-email-exists-error');
const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');
const AccountExpiredTimeoutError = require('../../errors/account-expired-timeout-error');
const AccountInvalidSecretError = require('../../errors/account-invalid-secret-error');
const AccountNotVerifiedError = require('../../errors/account-not-verified-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const INSERT = async (email) => {
    email = email.toLowerCase();

    const exists = await emailExists(email);

    if (exists) {
        throw new AccountEmailExistsError;
    }

    const hash = randomHash.uniqueHex();
    const secret = await encryption.strongEncrypt(hash);

    const displayName = randomHash.uuid();
    const days = Expiry.ACCOUNTS.VERIFY_DAYS;
    const date = dateFns.format(new Date, DateFormat.DEFAULT);
    const timeout = dateFns.addDays(date, days);
    const roleId = AccountRoleType.USER.id;

    const accountId = await SQLHelper.INSERT('account', { email, displayName });
    await SQLHelper.INSERT('account_role', { accountId, roleId });
    await SQLHelper.INSERT('account_verify', { accountId, secret, timeout });

    const payload = emailTemplates.accountCreate(email, hash, timeout);
    await mailer.sendMail(email, "Account Verification", payload);
    await testTools.saveHashToTestFile(hash);

    return { id: accountId };
};

const UPDATE = async (accountId, editorId, payload) => {
    logger.debug("sql-helper-accounts.UPDATE");

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    if (editorId !== accountId) {
        await roleSQLHelper.verifyAdminRoles(editorId, [ AccountRoleType.ADMIN, AccountRoleType.MOD_USER ]);
    }

    await SQLHelper.UPDATE('account', payload, { id: accountId });
};

const DELETE = async (accountId, editorId, editorRoles) => {
    logger.debug("sql-helper-accounts.DELETE");

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    if (editorId !== accountId) {
        await roleSQLHelper.verifyAdminRoles(editorId, [ AccountRoleType.ADMIN, AccountRoleType.MOD_USER ]);
    }

    const deletedText = `DELETED{{${accountId}}}`;
    const query = 'UPDATE account SET email = ?, is_verified = 0, password = NULL, display_name = ?, name_first = NULL, name_last = NULL, country = NULL, city = NULL, updated = CURRENT_TIMESTAMP, deleted = 1 WHERE id = ?';
    const array = [deletedText, deletedText, accountId];

    await SQLHelper.SQL(query, array);
};

const setDisplayName = async (accountId, editorId, displayName) => {
    logger.debug("sql-helper-accounts.setDisplayName");

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    if (editorId !== accountId) {
        await roleSQLHelper.verifyAdminRoles(editorId, [ AccountRoleType.ADMIN, AccountRoleType.MOD_USER ]);
    }

    displayName = displayName.toLowerCase();

    const exists = await displayNameExists(displayName);

    if (exists) {
        throw new AccountDisplayNameExistsError;
    }

    await SQLHelper.UPDATE('account', { display_name: displayName }, { id: accountId });
};

const getAccountIdFromEmail = async (email, requireVerified) => {
    logger.debug('accounts/sql-helper.getAccountIdFromEmail');

    email = email.toLowerCase();

    const rows = await SQLHelper.SELECT('account', ['id','is_verified'], { email });

    if (!rows || !rows.length) {
        throw new AccountNotFoundError;
    }

    const row = rows[0];

    if (requireVerified && !row.is_verified) {
        throw new AccountNotVerifiedError;
    }

    return row.id;
};

const compareSecretFromTable = async (table, id, secret) => {
    logger.debug('accounts/sql-helper.compareSecretFromTable');

    id = parseInt(id);

    const rows = await SQLHelper.SELECT(table, ['secret','timeout'], { account_id: id });

    if (!rows || !rows.length) {
        throw new AppError(400, 'Forbidden', 'You cannot set a new email without requesting an email change.');
    }

    const comparison = rows[0];

    const isValidSecret = await encryption.strongCompare(secret, comparison.secret);

    if (!isValidSecret) {
        throw new AccountInvalidSecretError(secret);
    }

    if (dateFns.isAfter(new Date(), new Date(comparison.timeout))) {
        throw new AccountExpiredTimeoutError;
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    INSERT,
    UPDATE,
    DELETE,
    setDisplayName,
    getAccountIdFromEmail,
    compareSecretFromTable,
};
