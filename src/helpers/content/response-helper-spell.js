'use strict';

const logger = require('../../logger/winston');
const genericRequestHelper = require('../common/request-helper-generic');
const { getPermission } = require('../common/request-helper-permission');
const { SELECT } = require('../common/sql-helper');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function POST(req, res, next) {
    logger.debug('content-response-helper-spell.POST', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const spellTypeId = parseInt(req.body.spell_type_id);

        const rows = await SELECT('spell_type', ['manifestation_id','expertise_id'], { id: spellTypeId });

        if (!rows || !rows.length) {
            return next(new AppError(400,
                "Spell Type not found!",
                "Spell Type was not found."));
        }

        const manifestationId = parseInt(rows[0].manifestation_id);
        const expertiseId = parseInt(rows[0].expertise_id);

        await getPermission(req, 'manifestation', manifestationId);
        await getPermission(req, 'spell_type', spellTypeId);
        await getPermission(req, 'expertise', expertiseId);

        req.body.manifestation_id = manifestationId;
        req.body.expertise_id = expertiseId;

        const id = await genericRequestHelper.INSERT(req, req.body, 'spell');

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
