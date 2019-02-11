'use strict';

const logger = require('../../logger/winston');
const relationRequestHelper = require('./request-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, table, relation, tableId) => {
    logger.debug('common-response-helper-relation.POST', req.log);

    try {
        await relationRequestHelper.INSERT(req, table, relation, tableId);
        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const PUT = async (req, res, next, table, relation, tableId, relationId) => {
    logger.debug('common-response-helper-relation.PUT', req.log);

    try {
        await relationRequestHelper.UPDATE(req, table, relation, tableId, relationId);
        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const DELETE = async (req, res, next, table, relation, tableId, relationId) => {
    logger.debug('common-response-helper-relation.DELETE', req.log);

    try {
        await relationRequestHelper.DELETE(req, table, relation, tableId, relationId);
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
    PUT,
    DELETE,
};
