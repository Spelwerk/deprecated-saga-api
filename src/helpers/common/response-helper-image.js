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
    logger.debug('common-response-helper-image.POST', req.log);

    try {
        const schema = getSchema(table);

        if (schema.security.account && !req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const table_has_image = `${table}_has_image`;
        const table_id = `${table}_id`;
        const imageId = req.body.image;

        await getPermission(req, table, tableId);
        await SQLHelper.INSERT(table_has_image, { [table_id]: tableId, image_id: imageId });

        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const DELETE = async (req, res, next, tableName, tableId, imageId) => {
    logger.debug('common-response-helper-image.DELETE', req.log);

    try {
        const schema = getSchema(tableName);

        if (schema.security.account && !req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const table_has_image = `${table}_has_image`;
        const table_id = `${table}_id`;

        await getPermission(req, table, tableId);
        await SQLHelper.DELETE(table_has_image, { [table_id]: tableId, image_id: imageId });

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
