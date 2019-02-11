'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { validator } = require('../../utils');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const insertMultiple = async (table, relation, creatureId, tableId) => {
    logger.debug('creature-sql-helper-add-items-from-table.addItemsToCreature');

    creatureId = parseInt(creatureId);
    tableId = parseInt(tableId);

    const creature_has_relation = `creature_has_${relation}`;
    const table_has_relation = `${table}_has_${relation}`;

    const table_id = `${table}_id`;
    const relation_id = `${relation}_id`;

    const rows = await SQLHelper.SELECT(table_has_relation, [relation_id], { [table_id]: tableId });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;

        const id = rows[i][relation_id];
        await SQLHelper.INSERT(creature_has_relation, { creature_id: creatureId, [relation_id]: id }, { [relation_id]: id });
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    insertMultiple,
};
