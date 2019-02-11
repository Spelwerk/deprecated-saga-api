'use strict';

const logger = require('../../logger/winston');
const genericSQLHelper = require('./sql-helper-generic');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const INSERT = async (req, body, tableName) => {
    logger.debug('common-sql-helper-generic.INSERT', req.log);
    return genericSQLHelper.INSERT(req.account.id, req.account.roles, body, tableName);
};

const UPDATE = async (req, body, tableName, tableId) => {
    logger.debug('common-sql-helper-generic.UPDATE', req.log);
    return genericSQLHelper.UPDATE(req.account.id, req.account.roles, body, tableName, tableId);
};

const DELETE = async (req, tableName, tableId) => {
    logger.debug('common-sql-helper-generic.DELETE', req.log);
    return genericSQLHelper.DELETE(req.account.id, req.account.roles, tableName, tableId);
};

const CLONE = async (req, tableName, tableId) => {
    logger.debug('common-sql-helper-generic.CLONE', req.log);
    return genericSQLHelper.CLONE(req.account.id, req.account.roles, tableName, tableId);
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
