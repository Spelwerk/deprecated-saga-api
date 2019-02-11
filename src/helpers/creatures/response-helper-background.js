'use strict';

const logger = require('../../logger/winston');
const relationRequestHelper = require('../common/request-helper-relation');
const addItemsFromTableSQLHelper = require('./sql-helper-add-items-from-table');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, creatureId) => {
    logger.debug('creature-response-helper-background.POST', req.log);

    try {
        const table = 'creature';
        const relation = 'background';
        await relationRequestHelper.INSERT(req, table, relation, creatureId);

        const backgroundId = parseInt(req.body.background_id);

        await addItemsFromTableSQLHelper.insertMultiple(table, 'armour', creatureId, backgroundId);
        await addItemsFromTableSQLHelper.insertMultiple(table, 'asset', creatureId, backgroundId);
        await addItemsFromTableSQLHelper.insertMultiple(table, 'bionic', creatureId, backgroundId);
        await addItemsFromTableSQLHelper.insertMultiple(table, 'shield', creatureId, backgroundId);
        await addItemsFromTableSQLHelper.insertMultiple(table, 'weapon', creatureId, backgroundId);

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
};
