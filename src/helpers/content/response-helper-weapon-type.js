'use strict';

const logger = require('../../logger/winston');
const genericRequestHelper = require('../common/request-helper-generic');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function POST(req, res, next) {
    logger.debug('content-response-helper-weapon-type.POST', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const expertise = {
            name: req.body.name + ' Mastery',
            description: req.body.description,
            skill_id: req.body.skill_id,
            species_id: req.body.species_id,
        };

        req.body.expertise_id = await genericRequestHelper.INSERT(req, expertise, 'expertise');
        req.body.equipable = !req.body.augmentation && !req.body.form && !req.body.manifestation && !req.body.species_id;

        const id = await genericRequestHelper.INSERT(req, req.body, 'weapon_type');

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
