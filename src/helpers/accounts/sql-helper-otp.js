'use strict';

const otplib = require('otplib');
const qrcode = require('qrcode');

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { encryption, randomHash, validator } = require('../../utils');
const { verifyAdminRoles } = require('./sql-helper-role');
const { AccountRoleType, OTPAuth } = require('../../constants');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');
const AccountOTPNotFoundError = require('../../errors/account-otp-not-found-error');
const AccountInvalidOTPError = require('../../errors/account-invalid-otp-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const INSERT = async (accountId) => {
    logger.debug('accounts/sql-helper-otp.INSERT');

    accountId = parseInt(accountId);

    const uuid = randomHash.uuid();
    const otpSecret = otplib.authenticator.generateSecret();
    const secret = encryption.simpleEncrypt(otpSecret);

    await SQLHelper.INSERT('account_otp', { uuid, accountId, secret });
    await SQLHelper.UPDATE('account', { isOtp: true }, { id: accountId });

    const url = otplib.authenticator.keyuri(uuid, OTPAuth.ISSUER, otpSecret);
    const imageData = await qrcode.toDataURL(url);

    return { url, imageData };
};

const DELETE = async (accountId, editorId) => {
    logger.debug('accounts/sql-helper-otp.DELETE');

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    if (editorId !== accountId) {
        await verifyAdminRoles(editorId, [ AccountRoleType.ADMIN, AccountRoleType.MOD_USER ]);
    }

    await SQLHelper.DELETE('account_otp', { accountId });
    await SQLHelper.UPDATE('account', { isOtp: false }, { id: accountId });
};

const verify = async (accountId, token) => {
    logger.debug('accounts/sql-helper-otp.verify');

    accountId = parseInt(accountId);

    const rows = await SQLHelper.SELECT('account_otp', ['secret'], { accountId });

    if (!rows && !rows.length) {
        throw new AccountOTPNotFoundError;
    }

    const secret = encryption.simpleDecrypt(rows[0].secret);
    const isValid = otplib.authenticator.verify({ token, secret });

    if (!isValid) {
        throw new AccountInvalidOTPError;
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    INSERT,
    DELETE,
    verify,
};
