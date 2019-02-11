'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('../common/sql-helper');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const GET = async (req, res, next, query, creatureId) => {
    logger.debug('creature-response-helper-combination.GET', req.log);

    try {
        const rows = await SQLHelper.SQL(query, [creatureId]);
        const result = rows.length !== 0
            ? rows[0]
            : null;

        res.status(200).send({ result });
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    GET,
};
