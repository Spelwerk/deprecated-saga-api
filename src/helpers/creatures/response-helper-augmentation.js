'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');
const { getPermission } = require('../common/request-helper-permission');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, creatureId, bionicId) => {
    logger.debug('creature-response-helper-augmentation.POST', req.log);

    try {
        await getPermission(req, 'creature', creatureId);

        const creature_id = parseInt(creatureId);
        const bionic_id = parseInt(bionicId);
        const augmentation_id = parseInt(req.body.augmentation_id);

        await SQLHelper.INSERT('creature_has_augmentation', { creature_id, bionic_id, augmentation_id }, { augmentation_id });

        res.status(204).send();
    } catch (e) {
        next(e);
    }
};

const DELETE = async (req, res, next, creatureId, bionicId, augmentationId) => {
    logger.debug('creature-response-helper-augmentation.DELETE', req.log);

    try {
        await getPermission(req, 'creature', creatureId);

        const creature_id = parseInt(creatureId);
        const bionic_id = parseInt(bionicId);
        const augmentation_id = parseInt(augmentationId);

        await SQLHelper.DELETE('creature_has_augmentation', { creature_id, bionic_id, augmentation_id });

        res.status(204).send();
    } catch (e) {
        next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    POST,
    DELETE,
};
