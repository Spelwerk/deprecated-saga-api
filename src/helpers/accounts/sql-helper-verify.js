'use strict';

const dateFns = require('date-fns');

const logger = require('../../logger/winston');
const { INSERT, UPDATE, DELETE } = require('../common/sql-helper');
const { getAccountIdFromEmail, compareSecretFromTable } = require('./sql-helper-account');
const { encryption, mailer, randomHash, testTools, validator } = require('../../utils');
const { displayNameExists } = require('./sql-helper-exists');
const { DateFormat, Expiry } = require('../../constants');
const refreshTokenHelper = require('./sql-helper-refresh-token');
const emailTemplates = require('../../templates/emails/index');

const AccountDisplayNameExistsError = require('../../errors/account-display-name-exists-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const sendEmail = async (email) => {
    const id = await getAccountIdFromEmail(email, false);

    const hash = randomHash.uniqueHex();
    const secret = await encryption.strongEncrypt(hash);

    const days = Expiry.ACCOUNTS.VERIFY_DAYS;
    const date = dateFns.format(new Date, DateFormat.DEFAULT);
    const timeout = dateFns.addDays(date, days);

    await INSERT('account_verify', { account_id: id, secret, timeout }, { secret, timeout });

    const payload = emailTemplates.accountVerify(hash, timeout);
    await mailer.sendMail(email, "Account Verification Request", payload);
    await testTools.saveHashToTestFile(hash);
};

const verifyAccount = async (email, secret, displayName, password, userAgent) => {
    const id = await getAccountIdFromEmail(email, false);
    await compareSecretFromTable('account_verify', id, secret);

    displayName = displayName.toLowerCase();
    password = password || null;

    const exists = await displayNameExists(displayName);

    if (exists) {
        throw new AccountDisplayNameExistsError;
    }

    if (password) {
        password = await encryption.onionEncrypt(password);
    }

    await UPDATE('account', { is_verified: 1, display_name: displayName, password }, { id });
    await DELETE('account_verify', { account_id: id });

    const { refreshToken, uuid } = await refreshTokenHelper.create(id, userAgent);

    return { id, refreshToken, uuid };
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    sendEmail,
    verifyAccount,
};
