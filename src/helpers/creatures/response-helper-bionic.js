'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const relationRequestHelper = require('../common/request-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const DELETE = async (req, res, next, creatureId, bionicId) => {
    logger.debug('creature-response-helper-bionic.DELETE', req.log);

    try {
        const table = 'creature';
        const relation = 'bionic';
        await relationRequestHelper.DELETE(req, table, relation, creatureId, bionicId);

        const creature_id = parseInt(creatureId);
        const bionic_id = parseInt(bionicId);

        await SQLHelper.DELETE('creature_has_augmentation', { creature_id, bionic_id });

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
