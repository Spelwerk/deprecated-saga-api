'use strict';

const logger = require('../../logger/winston');
const { SELECT, INSERT, UPDATE, DELETE } = require('../common/sql-helper');
const { validator } = require('../../utils');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const addSave = async (accountId, table, tableId) => {
    logger.debug('accounts/sql-helper-save-table.addSave');

    accountId = parseInt(accountId);
    tableId = parseInt(tableId);

    if (!accountId) {
        throw new AccountNotLoggedInError;
    }

    const account_has_table = `account_has_${table}`;
    const table_id = `${table}_id`;

    await INSERT(account_has_table, { account_id: accountId, [table_id]: tableId });
};

const deleteSave = async (accountId, table, tableId) => {
    logger.debug('accounts/sql-helper-save-table.deleteSave');

    accountId = parseInt(accountId);
    tableId = parseInt(tableId);

    if (!accountId) {
        throw new AccountNotLoggedInError;
    }

    const account_has_table = `account_has_${table}`;
    const table_id = `${table}_id`;

    await DELETE(account_has_table, { account_id: accountId, [table_id]: tableId });
};

const setFavorite = async (accountId, table, tableId, favorite) => {
    logger.debug('accounts/sql-helper-save-table.setFavorite');

    accountId = parseInt(accountId);
    tableId = parseInt(tableId);
    favorite = !!favorite;

    if (!accountId) {
        throw new AccountNotLoggedInError;
    }

    const account_has_table = `account_has_${table}`;
    const table_id = `${table}_id`;

    await UPDATE(account_has_table, { favorite }, { account_id: accountId, [table_id]: tableId });
};

const countFavorites = async (table, tableId) => {
    logger.debug('accounts/sql-helper-save-table.getFavorites');

    tableId = parseInt(tableId);

    const account_has_table = `account_has_${table}`;
    const table_id = `${table}_id`;

    let count = 0;
    let list = [];
    const rows = await SELECT(account_has_table, ['account_id'], { [table_id]: tableId, favorite: true });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;
        list.push(rows[i].account_id);
        count++;
    }

    return { count, list };
};

const countSaves = async (table, tableId) => {
    logger.debug('accounts/sql-helper-save-table.getSaves');

    tableId = parseInt(tableId);

    const account_has_table = `account_has_${table}`;
    const table_id = `${table}_id`;

    let count = 0;
    let list = [];
    const rows = await SELECT(account_has_table, ['account_id'], { [table_id]: tableId });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;
        list.push(rows[i].account_id);
        count++;
    }

    return { count, list };
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    addSave,
    deleteSave,
    setFavorite,
    countFavorites,
    countSaves,
};
