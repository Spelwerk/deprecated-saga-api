'use strict';

const dateFns = require('date-fns');

const logger = require('../../logger/winston');
const { SELECT, INSERT, DELETE } = require('../common/sql-helper');
const { getAccountIdFromEmail, compareSecretFromTable } = require('./sql-helper-account');
const { mailer, encryption, randomHash, testTools, validator } = require('../../utils');
const { DateFormat, Expiry } = require('../../constants');
const refreshTokenSQLHelper = require('./sql-helper-refresh-token');
const otpSQLHelper = require('./sql-helper-otp');
const emailTemplates = require('../../templates/emails');

const AccountInvalidPasswordError = require('../../errors/account-invalid-password-error');
const AccountNotFoundError = require('../../errors/account-not-found-error');
const AccountPasswordNotSetError = require('../../errors/account-password-not-set-error');
const AccountNotVerifiedError = require('../../errors/account-not-verified-error');
const AccountLockedError = require('../../errors/account-locked-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const sendEmail = async (email) => {
    const id = await getAccountIdFromEmail(email, true);

    const hash = randomHash.uniqueHex();
    const secret = await encryption.strongEncrypt(hash);

    const minutes = Expiry.ACCOUNTS.LOGIN_MINUTES;
    const date = dateFns.format(new Date, DateFormat.DEFAULT);
    const timeout = dateFns.addMinutes(date, minutes);

    await INSERT('account_login', { account_id: id, secret, timeout }, { secret, timeout });

    const payload = emailTemplates.accountLogin(hash, timeout);
    await mailer.sendMail(email, "Login Request", payload);
    await testTools.saveHashToTestFile(hash);
};

const validateLoginSecret = async (email, secret, userAgent) => {
    const id = await getAccountIdFromEmail(email, true);
    await compareSecretFromTable('account_login', id, secret);

    const { refreshToken, uuid } = await refreshTokenSQLHelper.create(id, userAgent);

    await DELETE('account_login', { account_id: id });

    return { refreshToken, uuid };
};

const withPassword = async (email, password, otpToken, userAgent) => {
    email = email.toLowerCase();
    const rows = await SELECT('account', ['id','is_verified','is_locked','is_otp','password'], { email });

    if (!rows || !rows.length) {
        throw new AccountNotFoundError;
    }

    const row = rows[0];

    if (!row.is_verified) {
        throw new AccountNotVerifiedError;
    }

    if (row.is_locked) {
        throw new AccountLockedError;
    }

    if (!row.password) {
        throw new AccountPasswordNotSetError;
    }

    const id = row.id;
    const comparison = row.password;

    const success = await encryption.onionCompare(password, comparison);

    if (!success) {
        throw new AccountInvalidPasswordError;
    }

    if (row.is_otp) {
        await otpSQLHelper.verify(id, otpToken);
    }

    const { refreshToken, uuid } = await refreshTokenSQLHelper.create(id, userAgent);

    return { refreshToken, uuid };
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    sendEmail,
    validateLoginSecret,
    withPassword,
};
