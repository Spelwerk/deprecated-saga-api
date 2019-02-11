'use strict';

const logger = require('../../logger/winston');
const genericRequestHelper = require('../common/request-helper-generic');
const { getPermission } = require('../common/request-helper-permission');
const { SELECT } = require('../common/sql-helper');

const AppError = require('../../errors/app-error');
const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function POST(req, res, next) {
    logger.debug('content-response-helper-spell-type.POST', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const manifestationId = parseInt(req.body.manifestation_id);

        await getPermission(req, 'manifestation', manifestationId);

        const rows = await SELECT('skill_is_manifestation', ['skill_id'], { manifestation_id: manifestationId });

        if (!rows || !rows.length) {
            return next(new AppError(400,
                "Skill not found!",
                "Skill related to manifestation was not found."));
        }

        const expertise = {
            name: req.body.name + ' Mastery',
            manifestation_id: manifestationId,
            skill_id: parseInt(rows[0].skill_id),
        };

        req.body.expertise_id = await genericRequestHelper.INSERT(req, expertise, 'expertise');

        const id = await genericRequestHelper.INSERT(req, req.body, 'spell_type');

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
