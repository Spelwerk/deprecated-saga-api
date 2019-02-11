'use strict';

const logger = require('../../logger/winston');
const genericRequestHelper = require('../common/request-helper-generic');
const { CreatureWeaponTypeId } = require('../../constants');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function POST(req, res, next) {
    logger.debug('content-response-helper-species.POST', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const id = await genericRequestHelper.INSERT(req, req.body, 'species');

        const weapon = {
            name: req.body.weapon || 'Brawl',
            description: 'Unarmed combat for the species: ' + req.body.name,
            weapon_type_id: CreatureWeaponTypeId.UNARMED,
            legal: 1,
            price: 0,
            damage_dice: 2,
            damage_bonus: 0,
            critical_dice: 1,
            critical_bonus: 0,
            distance: 0,
            species_id: id,
        };

        await genericRequestHelper.INSERT(req, weapon, 'weapon');

        res.status(201).send({ id });
    } catch (e) {
        return next(e);
    }
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    POST,
};
