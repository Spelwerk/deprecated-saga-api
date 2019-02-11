'use strict';

const { INSERT } = require('./sql-helper');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function insertSingle(tableName, tableId, combinationName, combinationId) {
    tableId = parseInt(tableId);
    combinationId = parseInt(combinationId);

    const table_is_combination = `${tableName}_is_${combinationName}`;
    const table_id = `${tableName}_id`;
    const combination_id = `${combinationName}_id`;

    await INSERT(table_is_combination, { [table_id]: tableId, [combination_id]: combinationId }, { [combination_id]: combinationId });
}

async function insertMultiple(tableName, tableId, combinationArray, body) {
    if (!combinationArray || !combinationArray.length) {
        return;
    }

    for (let i in combinationArray) {
        const combinationName = combinationArray[i];
        const key = `${combinationName}_id`;

        if (!body.hasOwnProperty(key)) continue;
        if (!body[key] || body[key] === '' || body[key] === 'undefined') continue;

        const combinationId = parseInt(body[key]);

        await insertSingle(tableName, tableId, combinationName, combinationId);
    }
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    insertMultiple,
    insertSingle,
};
