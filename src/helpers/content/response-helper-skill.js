'use strict';

const logger = require('../../logger/winston');
const genericRequestHelper = require('../common/request-helper-generic');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function POST(req, res, next) {
    logger.debug('content-response-helper-skill.POST', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const skill = {
            name: req.body.name,
            description: req.body.description,
            icon: req.body.icon,
            manifestation_id: req.body.manifestation_id,
            species_id: req.body.species_id,
        };

        const id = await genericRequestHelper.INSERT(req, skill, 'skill');

        const expertise = {
            name: req.body.name,
            description: 'Generic expertise used where the other expertises do not fit, and you still want to show you are extra good at something. You can use the Custom Description field to explain where this is applicable for your character. Remember that if you have a suggestion for a new expertise you can easily add it to the game system and your own created worlds. If the new expertise is of great quality it may even be adopted as canon by Spelwerk.',
            manifestation_id: req.body.manifestation_id,
            species_id: req.body.species_id,
            skill_id: id,
        };

        await genericRequestHelper.INSERT(req, expertise, 'expertise');

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
