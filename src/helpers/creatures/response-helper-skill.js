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

    const relation = 'skill';
    const loopTables = [
        'augmentation',
        'background',
        'bionic',
        'gift',
        'imperfection',
        'manifestation',
        'milestone',
        'species',
    ];
    const loopEquip = [
        'armour',
        'asset',
        'shield',
        'weapon',
    ];

    const query = 'SELECT ' +
        'skill.id, ' +
        'skill.name, ' +
        'skill.description, ' +
        'skill.icon, ' +
        'creature_has_skill.value AS value__original ' +
        'FROM creature_has_skill ' +
        'LEFT JOIN skill ON skill.id = creature_has_skill.skill_id ' +
        'WHERE ' +
        'creature_has_skill.creature_id = ?';

    try {
        let results = [];
        let addArray = [];
        const skills = await SQLHelper.SQL(query, [creatureId]);

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

        for (let i in skills) {
            const skill = skills[i];

            const original = parseInt(skill.value.original);
            let newValue = 0;

            for (let x in addArray) {
                if (skill.id === addArray[x].skill_id) {
                    newValue += addArray[x].value;
                }
            }

            skill.value.added = newValue;
            skill.value.total = original + newValue;

            results.push(skill);
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
