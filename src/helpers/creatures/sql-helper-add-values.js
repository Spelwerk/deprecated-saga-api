'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { getSchema } = require('../../initializers/database');
const { arrayReducer, validator } = require('../../utils');

const AppError = require('../../errors/app-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const getIdAndValuesFromTable = async (table, relation, tableId) => {
    logger.debug('sql-helper-add-values.getIdAndValuesFromTable');

    tableId = parseInt(tableId);

    const table_has_relation = `${table}_has_${relation}`;
    const table_id = `${table}_id`;
    const relation_id = `${relation}_id`;

    return await SQLHelper.SELECT(table_has_relation, [relation_id,'value'], { [table_id]: tableId });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const getRelationValuesFromTable = async (creatureId, relation, table, selectOnlyEquippedItems = false) => {
    logger.debug('sql-helper-add-values.getRelationValuesFromTable');

    creatureId = parseInt(creatureId);

    const schema = getSchema('creature');
    let creature_x_table;

    if (schema.tables.hasMany.indexOf(table) !== -1) {
        creature_x_table = `creature_has_${table}`;
    } else if (schema.tables.isOne.indexOf(table) !== -1) {
        creature_x_table = `creature_is_${table}`;
    } else {
        throw new AppError(500, 'Invalid relation on table fetch', 'The server is trying to fetch values from a table that does not exist');
    }

    const table_id = `${table}_id`;

    let select = [ table_id ];

    if (selectOnlyEquippedItems) {
        select = arrayReducer([select, 'equipped'])
    }

    const rows = await SQLHelper.SELECT(creature_x_table, select, { creature_id: creatureId });

    if (!rows || !rows.length) return [];

    let array = [];

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;

        const tableId = rows[i][table_id];

        if (selectOnlyEquippedItems) {
            const equipped = !!rows[i].equipped;
            if (!equipped) continue;
        }

        const list = await getIdAndValuesFromTable(table, relation, tableId);

        array = arrayReducer([array, list]);
    }

    return array;
};

module.exports = {
    getRelationValuesFromTable,
};
