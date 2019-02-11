'use strict';

const logger = require('../../logger/winston');
const relationRequestHelper = require('../common/request-helper-relation');
const addItemsFromTableSQLHelper = require('./sql-helper-add-items-from-table');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, creatureId) => {
    logger.debug('creature-sql-helper-milestone.INSERT', req.log);

    try {
        const table = 'creature';
        const relation = 'milestone';
        await relationRequestHelper.INSERT(req, table, relation, creatureId);

        const milestoneId = parseInt(req.body.milestone_id);

        await addItemsFromTableSQLHelper.insertMultiple(table, 'armour', creatureId, milestoneId);
        await addItemsFromTableSQLHelper.insertMultiple(table, 'asset', creatureId, milestoneId);
        await addItemsFromTableSQLHelper.insertMultiple(table, 'bionic', creatureId, milestoneId);
        await addItemsFromTableSQLHelper.insertMultiple(table, 'shield', creatureId, milestoneId);
        await addItemsFromTableSQLHelper.insertMultiple(table, 'weapon', creatureId, milestoneId);

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
