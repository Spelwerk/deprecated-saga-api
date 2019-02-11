'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { validator } = require('../../utils');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const addAttributesToCreature = async (creatureId, manifestationId) => {
    logger.debug('creature-sql-helper-manifestation.addAttributesToCreature');

    creatureId = parseInt(creatureId);
    manifestationId = parseInt(manifestationId);

    const rows = await SQLHelper.SELECT('attribute_is_manifestation', ['attribute_id'], { manifestation_id: manifestationId });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;

        const attributeId = parseInt(rows[i].attribute_id);
        await SQLHelper.INSERT('creature_has_attribute', { creature_id: creatureId, attribute_id: attributeId });
    }
};

const addSkillsToCreature = async (creatureId, manifestationId) => {
    logger.debug('creature-sql-helper-manifestation.addSkillsToCreature');

    creatureId = parseInt(creatureId);
    manifestationId = parseInt(manifestationId);

    const rows = await SQLHelper.SELECT('skill_is_manifestation', ['skill_id'], { manifestation_id: manifestationId });

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;

        const skillId = parseInt(rows[i].skill_id);
        await SQLHelper.INSERT('creature_has_skill', { creature_id: creatureId, skill_id: skillId });
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    addAttributesToCreature,
    addSkillsToCreature,
};
