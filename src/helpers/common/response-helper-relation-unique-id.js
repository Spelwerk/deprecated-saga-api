'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('./sql-helper');
const { getPermission } = require('./request-helper-permission');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const UPDATE = async (req, res, next, table, relation, tableId, uniqueId) => {
    logger.debug('common-sql-helper-relation-unique-id.UPDATE', req.log);

    try {
        await getPermission(req, table, tableId);

        const table_has_relation = `${table}_has_${relation}`;
        const table_id = `${table}_id`;

        await SQLHelper.UPDATE(table_has_relation, req.body, { [table_id]: tableId, id: uniqueId });

        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const DELETE = async (req, res, next, table, relation, tableId, uniqueId) => {
    logger.debug('common-sql-helper-relation-unique-id.DELETE', req.log);

    try {
        await getPermission(req, table, tableId);

        const table_has_relation = `${table}_has_${relation}`;
        const table_id = `${table}_id`;

        await SQLHelper.DELETE(table_has_relation, { [table_id]: tableId, id: uniqueId });

        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    UPDATE,
    DELETE,
};
