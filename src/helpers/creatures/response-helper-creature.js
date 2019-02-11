'use strict';

const logger = require('../../logger/winston');
const genericRequestHelper = require('../common/request-helper-generic');
const creatureSQLHelper = require('./sql-helper-creature');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next) => {
    logger.debug('creature-response-helper-creature.POST', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const epochId = parseInt(req.body.epoch_id);
        const speciesId = parseInt(req.body.species_id);

        const id = await genericRequestHelper.INSERT(req, req.body, 'creature');

        const worldId = await creatureSQLHelper.getWorldIdFromEpoch(epochId);

        await creatureSQLHelper.addAttributesToCreature(id, worldId, speciesId);
        await creatureSQLHelper.addSkillsToCreature(id, epochId, speciesId);

        res.status(201).send({ id });
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    POST,
};
