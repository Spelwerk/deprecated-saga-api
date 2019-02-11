'use strict';

const logger = require('../../logger/winston');
const relationSQLHelper = require('./sql-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const INSERT = async (req, table, relation, tableId) => {
    logger.debug('common-sql-helper-relation.INSERT');
    return relationSQLHelper.INSERT(req.account.id, req.account.roles, table, relation, tableId, req.body);
};

const UPDATE = async (req, table, relation, tableId, relationId) => {
    logger.debug('common-sql-helper-relation.UPDATE');
    return relationSQLHelper.UPDATE(req.account.id, req.account.roles, table, relation, tableId, relationId, req.body);
};

const DELETE = async (req, table, relation, tableId, relationId) => {
    logger.debug('common-sql-helper-relation.DELETE');
    return relationSQLHelper.DELETE(req.account.id, req.account.roles, table, relation, tableId, relationId);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    INSERT,
    UPDATE,
    DELETE,
};
