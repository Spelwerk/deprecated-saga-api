'use strict';

const _ = require('lodash');
const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { validator } = require('../../utils');

const AccountNotAdministratorError = require('../../errors/account-not-administrator-error');
const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const SELECT = async (accountId) => {
    accountId = parseInt(accountId);

    const rows = await SQLHelper.SQL('SELECT role.key FROM account_role LEFT JOIN role ON role.id = account_role.role_id WHERE account_id = ?', [accountId]);

    let roles = {};

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;
        const key = rows[i].key;
        roles[key] = true;
    }

    return roles;
};

const INSERT = async (accountId, editorId, roleId) => {
    logger.debug('accounts/sql-helper-roles.INSERT');

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);
    roleId = parseInt(roleId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    const editorRoles = await SELECT(editorId);

    if (!editorRoles.ADMIN) {
        throw new AccountNotAdministratorError;
    }

    await SQLHelper.INSERT('account_role', { account_id: accountId, role_id: roleId });
};

const DELETE = async (accountId, editorId, roleId) => {
    logger.debug('accounts/sql-helper-roles.DELETE');

    accountId = parseInt(accountId);
    editorId = parseInt(editorId);
    roleId = parseInt(roleId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    const setterRoles = await SELECT(editorId);

    if (!setterRoles.ADMIN) {
        throw new AccountNotAdministratorError;
    }

    await SQLHelper.DELETE('account_role', { account_id: accountId, role_id: roleId });
};

const verifyAdminRoles = async (editorId, roleKeys) => {
    logger.debug('accounts/sql-helper-roles.verifyAdminRoles');

    editorId = parseInt(editorId);

    if (!editorId) {
        throw new AccountNotLoggedInError;
    }

    const roles = await SELECT(editorId);

    for (let i in roleKeys) {
        if (!roleKeys.hasOwnProperty(i)) continue;
        const key = roleKeys[i].key;
        if (roles[key]) return;
    }

    throw new AccountNotAdministratorError;
};

module.exports = {
    SELECT,
    INSERT,
    DELETE,
    verifyAdminRoles,
};
