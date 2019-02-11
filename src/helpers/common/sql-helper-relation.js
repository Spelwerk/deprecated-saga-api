'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('./sql-helper');
const permissionSQLHelper = require('./sql-helper-permission');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const INSERT = async (accountId, accountRoles, table, relation, tableId, payload) => {
    logger.debug('common-sql-helper-relation.INSERT');

    tableId = parseInt(tableId);

    await permissionSQLHelper.getPermission(accountId, accountRoles, table, tableId);

    const table_has_relation = `${table}_has_${relation}`;
    const table_id = `${table}_id`;

    await SQLHelper.INSERT(table_has_relation, { ...payload, [table_id]: tableId }, { ...payload });
    await SQLHelper.UPDATE(table, {}, { id: tableId });
};

const UPDATE = async (accountId, accountRoles, table, relation, tableId, relationId, payload) => {
    logger.debug('common-sql-helper-relation.UPDATE');

    tableId = parseInt(tableId);
    relationId = parseInt(relationId);

    await permissionSQLHelper.getPermission(accountId, accountRoles, table, tableId);

    const table_has_relation = `${table}_has_${relation}`;
    const table_id = `${table}_id`;
    const relation_id = `${relation}_id`;

    await SQLHelper.UPDATE(table_has_relation, { ...payload }, { [table_id]: tableId, [relation_id]: relationId });
    await SQLHelper.UPDATE(table, {}, { id: tableId });
};

const DELETE = async (accountId, accountRoles, table, relation, tableId, relationId) => {
    logger.debug('common-sql-helper-relation.DELETE');

    tableId = parseInt(tableId);
    relationId = parseInt(relationId);

    await permissionSQLHelper.getPermission(accountId, accountRoles, table, tableId);

    const table_has_relation = `${table}_has_${relation}`;
    const table_id = `${table}_id`;
    const relation_id = `${relation}_id`;

    await SQLHelper.DELETE(table_has_relation, { [table_id]: tableId, [relation_id]: relationId });
    await SQLHelper.UPDATE(table, {}, { id: tableId });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    INSERT,
    UPDATE,
    DELETE,
};
