'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('./sql-helper');
const { getSchema } = require('../../initializers/database');
const { getPermission } = require('./request-helper-permission');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, table, tableId) => {
    logger.debug('common-response-helper-label.POST', req.log);

    try {
        const schema = getSchema(table);

        if (schema.security.account && !req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const table_has_label = `${table}_has_label`;
        const table_id = `${table}_id`;
        const name = req.body.label.toString().toLowerCase();

        await getPermission(req, table, tableId);

        const rows = await SQLHelper.SELECT('label', ['id'], { name });

        let id;

        if (rows && rows.length) {
            id = rows[0].id;
        } else {
            id = await SQLHelper.INSERT('label', { name });
        }

        await SQLHelper.INSERT(table_has_label, { [table_id]: tableId, label_id: id });

        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const DELETE = async (req, res, next, tableName, tableId, labelId) => {
    logger.debug('common-response-helper-label.DELETE', req.log);

    try {
        const schema = getSchema(tableName);

        if (schema.security.account && !req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const table_has_label = `${table}_has_label`;
        const table_id = `${table}_id`;

        await getPermission(req, table, tableId);
        await SQLHelper.DELETE(table_has_label, { [table_id]: tableId, label_id: labelId });

        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    POST,
    DELETE,
};
