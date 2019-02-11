'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const relationRequestHelper = require('../common/request-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const DELETE = async (req, res, next, creatureId, weaponId) => {
    logger.debug('creature-sql-helper-weapon.DELETE', req.log);

    try {
        const table = 'creature';
        const relation = 'weapon';
        await relationRequestHelper.DELETE(req, table, relation, creatureId, weaponId);

        const creature_id = parseInt(creatureId);
        const weapon_id = parseInt(weaponId);

        await SQLHelper.DELETE('creature_has_weapon_mod', { creature_id, weapon_id });

        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    DELETE,
};
