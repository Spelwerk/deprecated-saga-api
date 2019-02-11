'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('./sql-helper');
const combinationTableHelper = require('./sql-helper-combination');
const permissionSQLHelper = require('./sql-helper-permission');
const { getSchema } = require('../../initializers/database');

const AccountNotAdministratorError = require('../../errors/account-not-administrator-error');
const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const populateBodyWithCombinations = async (body, tableName, tableId, schema) => {
    logger.debug('common-sql-helper-generic.populateBodyWithCombinations');

    tableId = parseInt(tableId);

    const array = schema.tables.isOne;

    for (let i in array) {
        const combinationName = array[i];

        const table_is_combination = `${tableName}_is_${combinationName}`;
        const table_id = `${tableName}_id`;

        const rows = await SQLHelper.SELECT(table_is_combination, ['*'], { [table_id]: tableId });

        if (rows && rows.length) {
            const combination_id = `${combinationName}_id`;
            const row = rows[0];

            body[combination_id] = row[combination_id];
        }
    }

    return body;
};

const cloneRelations = async (tableName, tableId, cloneId, schema) => {
    logger.debug('common-sql-helper-generic.cloneRelations');

    tableId = parseInt(tableId);
    cloneId = parseInt(cloneId);

    const array = schema.tables.hasMany;

    for (let i in array) {
        const relationName = array[i];

        const table_has_relation = `${tableName}_has_${relationName}`;
        const table_id = `${tableName}_id`;

        const rows = await SQLHelper.SELECT(table_has_relation, ['*'], { [table_id]: tableId });

        if (!rows && !rows.length) return;

        let query = `INSERT INTO ${table_has_relation} (`;
        let values = ' VALUES ';
        let list = [];

        // Loop cols and add field name to the SQL String
        const fieldRow = rows[0];
        for (let key in fieldRow) {
            if (key === 'id') continue;

            query += key + ',';
        }

        // Loop body/results and add field values to the String
        for (let key in rows) {
            if (!rows.hasOwnProperty(key)) continue;

            const row = rows[key];

            values += '(';

            // Loop row and copy value to the String
            // Do not copy original tableId, insert newId instead
            for (let key in row) {
                if (!row.hasOwnProperty(key)) continue;
                if (key === 'id') continue;

                values += '?,';

                const tableKeyName = `${tableName}_id`;

                if (key.indexOf(tableKeyName) !== -1) {
                    list.push(cloneId);
                } else {
                    list.push(row[key]);
                }
            }

            values = values.slice(0, -1) + '),';
        }

        query = query.slice(0, -1) + ')';
        values = values.slice(0, -1);

        query += values;

        await SQLHelper.SQL(query, list);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const INSERT = async (accountId, accountRoles, body, tableName) => {
    logger.debug('common-sql-helper-generic.INSERT');

    accountId = parseInt(accountId);

    const schema = getSchema(tableName);

    if (schema.security.account && !accountId) {
        throw new AccountNotLoggedInError;
    }

    if (schema.security.admin && !accountRoles.ADMIN) {
        throw new AccountNotAdministratorError;
    }

    const id = await SQLHelper.INSERT(tableName, { account_id: accountId, ...body });
    await combinationTableHelper.insertMultiple(tableName, id, schema.tables.isOne, body);

    return id;
};

const UPDATE = async (accountId, accountRoles, body, tableName, tableId) => {
    logger.debug('common-sql-helper-generic.UPDATE');

    accountId = parseInt(accountId);
    tableId = parseInt(tableId);

    const schema = getSchema(tableName);

    if (schema.security.account) {
        await permissionSQLHelper.getPermission(accountId, accountRoles, tableName, tableId);
    }

    if (schema.security.admin && !accountRoles.ADMIN) {
        throw new AccountNotAdministratorError;
    }

    await SQLHelper.UPDATE(tableName, { ...body }, { id: tableId });
    await combinationTableHelper.insertMultiple(tableName, tableId, schema.tables.isOne, body);
};

const DELETE = async (accountId, accountRoles, tableName, tableId) => {
    logger.debug('common-sql-helper-generic.DELETE');

    accountId = parseInt(accountId);
    tableId = parseInt(tableId);

    const schema = getSchema(tableName);

    if (schema.security.account) {
        await permissionSQLHelper.getPermission(accountId, accountRoles, tableName, tableId);
    }

    if (schema.security.admin && !accountRoles.ADMIN) {
        throw new AccountNotAdministratorError;
    }

    if (schema.fields.deleted) {
        return await SQLHelper.HIDE(tableName, { id: tableId });
    }

    await SQLHelper.DELETE(tableName, { id: tableId });
};

const CLONE = async (accountId, accountRoles, tableName, tableId) => {
    logger.debug('common-sql-helper-generic.CLONE');

    accountId = parseInt(accountId);
    tableId = parseInt(tableId);

    const schema = getSchema(tableName);

    if (schema.security.account && !accountId) {
        throw new AccountNotLoggedInError;
    }

    if (schema.security.admin && !accountRoles.ADMIN) {
        throw new AccountNotAdministratorError;
    }

    const rows = await SQLHelper.SELECT(tableName, ['*'], { id: tableId });
    const row = rows[0];

    // SQLHelper.SELECT Combination Relations into body
    const body = await populateBodyWithCombinations(row, tableName, tableId, schema);

    // CREATE new row in table
    const cloneId = await INSERT(accountId, accountRoles, body, tableName);

    // COPY Has Relations
    await cloneRelations(tableName, tableId, cloneId, schema);

    // Create copy combination relation if expected
    if (schema.security.account) {
        await combinationTableHelper.insertSingle(tableName, cloneId, 'copy', tableId);
    }

    return cloneId;
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    INSERT,
    UPDATE,
    DELETE,
    CLONE,
};
