'use strict';

const logger = require('../../logger/winston');
const genericRequestHelper = require('../common/request-helper-generic');
const { CreatureAttributeTypeId } = require('../../constants');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function POST(req, res, next) {
    logger.debug('content-response-helper-manifestation.POST', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const id = await genericRequestHelper.INSERT(req, req.body, 'manifestation');

        const attribute = {
            name: req.body.power,
            description: 'Power for: ' + req.body.name,
            icon: req.body.icon,
            attribute_type_id: CreatureAttributeTypeId.POWER,
            is_optional: 1,
            minimum: 0,
            maximum: req.body.maximum,
            manifestation_id: id,
        };

        await genericRequestHelper.INSERT(req, attribute, 'attribute');

        const skill = {
            name: req.body.skill,
            description: 'Skill for: ' + req.body.name,
            icon: req.body.icon,
            manifestation_id: id,
        };

        await genericRequestHelper.INSERT(req, skill, 'skill');

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
