'use static';

const dateFns = require('date-fns');

const logger = require('../../logger/winston');
const { SELECT, INSERT, UPDATE, DELETE } = require('../common/sql-helper');
const { getAccountIdFromEmail, compareSecretFromTable } = require('./sql-helper-account');
const { verifyAdminRoles } = require('./sql-helper-role');
const { encryption, mailer, randomHash, testTools, validator } = require('../../utils');
const { DateFormat, Expiry, AccountRoleType } = require('../../constants');
const emailTemplates = require('../../templates/emails');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const setEmailAndNotify = async (accountId, oldEmail, newEmail) => {
    await UPDATE('account', { email: newEmail }, { id: accountId });
    await DELETE('account_email', { account_id: accountId });

    const payload = emailTemplates.accountChangeEmailConfirmation(newEmail);
    await mailer.sendMail(newEmail, "Email has changed", payload);
    await mailer.sendMail(oldEmail, "Email has changed", payload);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const sendEmail = async (email) => {
    const accountId = await getAccountIdFromEmail(email, true);

    const hash = randomHash.uniqueHex();
    const secret = await encryption.strongEncrypt(hash);

    const minutes = Expiry.ACCOUNTS.EMAIL_MINUTES;
    const date = dateFns.format(new Date, DateFormat.DEFAULT);
    const timeout = dateFns.addMinutes(date, minutes);

    await INSERT('account_email', { account_id: accountId, secret, timeout }, { secret, timeout });

    const payload = emailTemplates.accountChangeEmail(email, hash, timeout);
    await mailer.sendMail(email, 'Email Change Request', payload);
    await testTools.saveHashToTestFile(hash);
};

const setNewEmail = async (oldEmail, secret, newEmail) => {
    const accountId = await getAccountIdFromEmail(oldEmail, true);
    await compareSecretFromTable('account_email', accountId, secret);

    newEmail = newEmail.toLowerCase();

    await setEmailAndNotify(accountId, oldEmail, newEmail);
};

const setNewEmailAsAdmin = async (accountId, editorId, newEmail) => {
    accountId = parseInt(accountId);
    editorId = parseInt(editorId);

    await verifyAdminRoles(editorId, [ AccountRoleType.ADMIN, AccountRoleType.MOD_USER ]);

    const rows = await SELECT('account', ['email'], { id: accountId });
    const oldEmail = rows[0].email;

    await setEmailAndNotify(accountId, oldEmail, newEmail);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    sendEmail,
    setNewEmail,
    setNewEmailAsAdmin,
};
