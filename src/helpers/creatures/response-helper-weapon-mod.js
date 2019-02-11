'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { getPermission } = require('../common/request-helper-permission');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, creatureId, weaponId) => {
    logger.debug('creature-sql-helper-weapon-mod.POST', req.log);

    try {
        await getPermission(req, 'creature', creatureId);

        const creature_id = parseInt(creatureId);
        const weapon_id = parseInt(weaponId);
        const weapon_mod_id = parseInt(req.body.weapon_mod_id);

        await SQLHelper.INSERT('creature_has_weapon_mod', { creature_id, weapon_id, weapon_mod_id }, { weapon_mod_id });
    } catch (e) {
        return next(e);
    }
};

const DELETE = async (req, res, next, creatureId, weaponId, weaponModId) => {
    logger.debug('creature-sql-helper-weapon-mod.DELETE', req.log);

    try {
        await getPermission(req, 'creature', creatureId);

        const creature_id = parseInt(creatureId);
        const weapon_id = parseInt(weaponId);
        const weapon_mod_id = parseInt(weaponModId);

        await SQLHelper.DELETE('creature_has_weapon_mod', { creature_id, weapon_id, weapon_mod_id });
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    POST,
    DELETE,
};
