'use strict';

const logger = require('../../logger/winston');
const manifestationSQLHelper = require('./sql-helper-manifestation');
const relationRequestHelper = require('../common/request-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, creatureId) => {
    logger.debug('creature-sql-helper-manifestation.POST', req.log);

    try {
        const table = 'creature';
        const relation = 'manifestation';
        await relationRequestHelper.INSERT(req, table, relation, creatureId);

        const manifestationId = parseInt(req.body.manifestation_id);

        await manifestationSQLHelper.addAttributesToCreature(creatureId, manifestationId);
        await manifestationSQLHelper.addSkillsToCreature(creatureId, manifestationId);

        res.status(204).send();
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
