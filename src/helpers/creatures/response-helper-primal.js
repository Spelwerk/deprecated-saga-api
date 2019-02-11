'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const addValuesSQLHelper = require('./sql-helper-add-values');
const { arrayReducer } = require('../../utils');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const GET = async (req, res, next, creatureId) => {
    logger.debug('response-helper-attribute.GET', req.log);

    const relation = 'primal';
    const loopTables = [];
    const loopEquip = [
        'armour',
        'asset',
        'shield',
        'weapon',
    ];

    const query = 'SELECT ' +
        'primal.id, ' +
        'primal.name, ' +
        'primal.description, ' +
        'primal.effects, ' +
        'primal.icon, ' +
        'primal.maximum, ' +
        'primal.manifestation_id AS manifestation__id, ' +
        'primal.expertise_id AS expertise__id, ' +
        'creature_has_primal.value AS value__original ' +
        'FROM creature_has_primal ' +
        'LEFT JOIN primal ON primal.id = creature_has_primal.primal_id ' +
        'WHERE ' +
        'creature_has_primal.creature_id = ?';

    try {
        let results = [];
        let addArray = [];
        const primals = await SQLHelper.SQL(query, [creatureId]);

        for (let i in loopTables) {
            const table = loopTables[i];
            const array = await addValuesSQLHelper.getRelationValuesFromTable(creatureId, relation, table, false);
            addArray = arrayReducer([addArray, array]);
        }

        for (let i in loopEquip) {
            const table = loopEquip[i];
            const array = await addValuesSQLHelper.getRelationValuesFromTable(creatureId, relation, table, true);
            addArray = arrayReducer([addArray, array]);
        }

        for (let i in primals) {
            const primal = primals[i];

            const original = parseInt(primal.value.original);
            let newValue = 0;

            for (let x in addArray) {
                if (primal.id === addArray[x].primal_id) {
                    newValue += addArray[x].value;
                }
            }

            primal.value.added = newValue;
            primal.value.total = original + newValue;

            results.push(primal);
        }

        res.status(200).send({ results });
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    GET,
};
