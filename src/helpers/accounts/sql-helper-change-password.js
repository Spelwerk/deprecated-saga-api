'use strict';

const dateFns = require('date-fns');
const utility = require('spelwerk-service-utility');

const logger = require('../../logger/winston');
const { INSERT, UPDATE, DELETE } = require('../common/sql-helper');
const { getAccountIdFromEmail, compareSecretFromTable } = require('./sql-helper-account');
const { verifyAdminRoles } = require('./sql-helper-role');
const { encryption, mailer, randomHash, testTools, validator } = require('../../utils');
const { DateFormat, Expiry, AccountRoleType } = require('../../constants');
const emailTemplates = require('../../templates/emails');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const setPasswordAndNotify = async (accountId, newPassword) => {
    const encryptedPassword = await encryption.onionEncrypt(newPassword);

    await UPDATE('account', { password: encryptedPassword }, { id: accountId });
    await DELETE('account_password', { account_id: accountId });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const sendEmail = async (email) => {
    const accountId = await getAccountIdFromEmail(email, true);

    const hash = randomHash.uniqueHex();
    const secret = await encryption.strongEncrypt(hash);

    const minutes = Expiry.ACCOUNTS.PASSWORD_MINUTES;
    const date = dateFns.format(new Date, DateFormat.DEFAULT);
    const timeout = dateFns.addMinutes(date, minutes);

    await INSERT('account_password', { account_id: accountId, secret, timeout }, { secret, timeout });

    const payload = emailTemplates.accountChangePassword(hash, timeout);
    await mailer.sendMail(email, "Set Password Request", payload);
    await testTools.saveHashToTestFile(hash);
};

const setNewPassword = async (email, secret, newPassword) => {
    const accountId = await getAccountIdFromEmail(email, true);
    await compareSecretFromTable('account_password', accountId, secret);
    await setPasswordAndNotify(accountId, newPassword);
};

const setNewPasswordAsAdmin = async (accountId, editorId, newPassword) => {
    accountId = parseInt(accountId);
    editorId = parseInt(editorId);

    await verifyAdminRoles(editorId, [ AccountRoleType.ADMIN, AccountRoleType.MOD_USER ]);
    await setPasswordAndNotify(accountId, newPassword);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    sendEmail,
    setNewPassword,
    setNewPasswordAsAdmin,
};
