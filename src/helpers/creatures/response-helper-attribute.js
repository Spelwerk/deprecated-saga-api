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

    const relation = 'attribute';
    const loopTables = [
        'augmentation',
        'background',
        'bionic',
        'expertise',
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
        'attribute.id, ' +
        'attribute.name, ' +
        'attribute.description, ' +
        'creature_has_attribute.value AS value__original ' +
        'FROM creature_has_attribute ' +
        'LEFT JOIN attribute ON attribute.id = creature_has_attribute.attribute_id ' +
        'WHERE ' +
        'creature_has_attribute.creature_id = ? AND ' +
        'attribute.attribute_type_id = ?';

    try {
        let results = [];
        let addArray = [];
        const types = await SQLHelper.SELECT('attribute_type', ['id','name','description']);

        for (let i in types) {
            if (!types.hasOwnProperty(i)) continue;

            const id = types[i].id;
            const name = types[i].name;
            const description = types[i].description;
            const attributes = await SQLHelper.SQL(query, [creatureId, id]);

            if (!attributes || !attributes.length) continue;

            let object = {
                id,
                name,
                description,
                attributes,
            };

            results.push(object);
        }

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

        for (let i in results) {
            const attributes = results[i].attributes;

            for (let n in attributes) {
                const attribute = attributes[n];
                const original = parseInt(attribute.value.original);
                let newValue = 0;

                for (let x in addArray) {
                    if (attribute.id === addArray[x].attribute_id) {
                        newValue += addArray[x].value;
                    }
                }

                attribute.value.added = newValue;
                attribute.value.total = original + newValue;
            }
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
