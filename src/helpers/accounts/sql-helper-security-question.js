'use strict';

const _ = require('lodash');
const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { encryption, validator } = require('../../utils');

const AppError = require('../../errors/app-error');
const AccountNotAdministratorError = require('../../errors/account-not-administrator-error');
const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');
const AccountNotAllowedToEditError = require('../../errors/account-not-allowed-to-edit-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const SELECT = async (accountId) => {
    logger.debug('accounts/sql-helper-security-question.SELECT');

    accountId = parseInt(accountId);

    const query = 'SELECT ' +
        'security_question.id, ' +
        'security_question.text ' +
        'FROM ' +
        'account_security_question ' +
        'LEFT JOIN security_question ON security_question.id = account_security_question.security_question_id ' +
        'WHERE account_security_question.account_id = ?';

    return await SQLHelper.SQL(query, [accountId]);
};

const COUNT = async (accountId) => {
    logger.debug('accounts/sql-helper-security-question.SELECT');

    accountId = parseInt(accountId);

    return await SQLHelper.COUNT('account_security_question', { accountId });
};

const INSERT = async (accountId, editorId, securityQuestionId, answer) => {
    logger.debug('accounts/sql-helper-security-question.INSERT');

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);
    securityQuestionId = parseInt(securityQuestionId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    if (accountId !== editorId) {
        throw new AccountNotAllowedToEditError;
    }

    answer = encryption.strongEncrypt(answer);

    await SQLHelper.INSERT('account_security_question', { accountId, securityQuestionId, answer });
    await setSecure(accountId);
};

const UPDATE = async (accountId, editorId, securityQuestionId, answer) => {
    logger.debug('accounts/sql-helper-security-question.UPDATE');

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);
    securityQuestionId = parseInt(securityQuestionId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    if (accountId !== editorId) {
        throw new AccountNotAllowedToEditError;
    }

    answer = encryption.strongEncrypt(answer);

    await SQLHelper.UPDATE('account_security_question', { answer }, { accountId, securityQuestionId });
};

const DELETE = async (accountId, editorId, securityQuestionId) => {
    logger.debug('accounts/sql-helper-security-question.DELETE');

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);
    securityQuestionId = parseInt(securityQuestionId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    const editorRoles = await SELECT(editorId);

    if (accountId !== editorId && (!editorRoles.ADMIN || !editorRoles.MOD_USER)) {
        throw new AccountNotAdministratorError;
    }

    await SQLHelper.DELETE('account_security_question', { accountId, securityQuestionId });
    await setSecure(accountId);
};

const setSecure = async (accountId) => {
    logger.debug('accounts/sql-helper-security-question.setSecure');

    accountId = parseInt(accountId);

    let isSecure = false;
    const amount = await COUNT(accountId);

    if (amount > 2) {
        isSecure = true;
    }

    await SQLHelper.UPDATE('account', { isSecure }, { id: accountId });
};

const getValidation = async (accountId) => {
    logger.debug('accounts/sql-helper-security-question.getValidation');

    accountId = parseInt(accountId);

    const query = 'SELECT ' +
        'security_question.id, ' +
        'security_question.text ' +
        'FROM ' +
        'account_security_question ' +
        'LEFT JOIN security_question ON security_question.id = account_security_question.security_question_id ' +
        'WHERE account_security_question.account_id = ? ' +
        'ORDER BY RAND() LIMIT 1';

    const rows = await SQLHelper.SQL(query, [accountId]);

    if (!rows && !rows.length) {
        throw new AppError(400, 'Security Questions not found', 'Could not find any security questions for this account.');
    }

    return rows[0];
};

const tryValidation = async (accountId, securityQuestionId, answer) => {
    logger.debug('accounts/sql-helper-security-question.UPDATE');

    accountId = parseInt(accountId);
    securityQuestionId = parseInt(securityQuestionId);

    if (!accountId) {
        throw new AccountNotLoggedInError;
    }

    const rows = await SQLHelper.SELECT('account_security_question', ['answer'], { accountId, securityQuestionId });

    if (!rows && !rows.length) {
        throw new AppError(400, 'Security Question not found', 'Could not find a security question with that ID.');
    }

    const realAnswer = rows[0].answer;
    const result = encryption.strongCompare(answer, realAnswer);

    if (!result) {
        throw new AppError(403, 'Wrong answer', 'The provided answer did not match the one in database.');
    }
};

module.exports = {
    SELECT,
    COUNT,
    INSERT,
    UPDATE,
    DELETE,
    setSecure,
    getValidation,
    tryValidation,
};
