'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { validator } = require('../../utils');

const DatabaseRowNotFoundError = require('../../errors/database-row-not-found-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const getAttributesFromTable = async (table, id) => {
    logger.debug('creature-sql-helper-creature.getAttributesFromTable');

    id = parseInt(id);

    const table_has_attribute = `${table}_has_attribute`;
    const table_id = `${table}_id`;

    let object = {};

    const rows = await SQLHelper.SELECT(table_has_attribute, ['*'], { [table_id]: id });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;
        const id = parseInt(rows[i].attribute_id);
        object[id] = parseInt(rows[i].value);
    }

    return object;
};

const getMandatorySkills = async () => {
    logger.debug('creature-sql-helper-creature.getMandatorySkills');

    let array = [];

    const rows = await SQLHelper.SELECT('skill', ['id'], { is_optional: false });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;

        array.push(parseInt(rows[i].id));
    }

    return array;
};

const getEpochSkills = async (id) => {
    logger.debug('creature-sql-helper-creature.getEpochSkills');

    id = parseInt(id);

    let array = [];

    const rows = await SQLHelper.SELECT('epoch_has_skill', ['skill_id'], { epoch_id: id });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;

        array.push(parseInt(rows[i].skill_id));
    }

    return array;
};

const getSpeciesSkills = async (id) => {
    logger.debug('creature-sql-helper-creature.getSpeciesSkills');

    id = parseInt(id);

    let array = [];

    const rows = await SQLHelper.SELECT('skill_is_species', ['skill_id'], { species_id: id });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;

        array.push(parseInt(rows[i].skill_id));
    }

    return array;
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const getWorldIdFromEpoch = async (id) => {
    logger.debug('creature-sql-helper-creature.getWorldIdFromEpoch');

    id = parseInt(id);

    const rows = await SQLHelper.SELECT('epoch', ['world_id'], { id });

    if (!rows && !rows.length) {
        throw new DatabaseRowNotFoundError;
    }

    return rows[0].world_id;
};

const addAttributesToCreature = async (creatureId, worldId, speciesId) => {
    logger.debug('creature-sql-helper-creature.addAttributesToCreature');

    creatureId = parseInt(creatureId);
    worldId = parseInt(worldId);
    speciesId = parseInt(speciesId);

    const worldAttributes = await getAttributesFromTable('world', worldId);
    const speciesAttributes = await getAttributesFromTable('species', speciesId);

    let creatureAttributes = {};

    for (let key in worldAttributes) {
        if (!worldAttributes.hasOwnProperty(key)) continue;
        creatureAttributes[key] = parseInt(worldAttributes[key]);
    }

    for (let key in speciesAttributes) {
        if (!speciesAttributes.hasOwnProperty(key)) continue;
        creatureAttributes[key] = parseInt(creatureAttributes[key]) + parseInt(speciesAttributes[key]);
    }

    for (let key in creatureAttributes) {
        if (!creatureAttributes.hasOwnProperty(key)) continue;
        const creature_id = creatureId;
        const attribute_id = key;
        const value = creatureAttributes[key];

        await SQLHelper.INSERT('creature_has_attribute', { creature_id, attribute_id, value });
    }
};

const addSkillsToCreature = async (creatureId, epochId, speciesId) => {
    logger.debug('creature-sql-helper-creature.addSkillsToCreature');

    creatureId = parseInt(creatureId);
    epochId = parseInt(epochId);
    speciesId = parseInt(speciesId);

    const mandatorySkills = await getMandatorySkills();
    const epochSkills = await getEpochSkills(epochId);
    const speciesSkills = await getSpeciesSkills(speciesId);

    let creatureSkills = [];

    for (let i in mandatorySkills) {
        if (!mandatorySkills.hasOwnProperty(i)) continue;
        if (creatureSkills.indexOf(mandatorySkills[i]) !== -1) continue;
        creatureSkills.push(mandatorySkills[i]);
    }

    for (let i in epochSkills) {
        if (!epochSkills.hasOwnProperty(i)) continue;
        if (creatureSkills.indexOf(epochSkills[i]) !== -1) continue;
        creatureSkills.push(epochSkills[i]);
    }

    for (let i in speciesSkills) {
        if (!speciesSkills.hasOwnProperty(i)) continue;
        if (creatureSkills.indexOf(speciesSkills[i]) !== -1) continue;
        creatureSkills.push(speciesSkills[i]);
    }

    for (let i in creatureSkills) {
        if (!creatureSkills.hasOwnProperty(i)) continue;
        const creature_id = creatureId;
        const skill_id = creatureSkills[i];

        await SQLHelper.INSERT('creature_has_skill', { creature_id, skill_id });
    }
};

module.exports = {
    getWorldIdFromEpoch,
    addAttributesToCreature,
    addSkillsToCreature,
};
