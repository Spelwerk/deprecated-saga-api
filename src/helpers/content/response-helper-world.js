'use strict';

const logger = require('../../logger/winston');
const genericRequestHelper = require('../common/request-helper-generic');
const SQLHelper = require('../common/sql-helper');

const AppError = require('../../errors/app-error');
const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

async function POST(req, res, next) {
    logger.debug('content-response-helper-world.POST', req.log);

    try {
        if (!req.account.id) {
            return next(new AccountNotLoggedInError);
        }

        const id = await genericRequestHelper.INSERT(req, req.body, 'world');

        const rows = await SQLHelper.SELECT('attribute', ['id','minimum','maximum'], { is_optional: 0 });

        if (!rows || !rows.length) {
            return next(new AppError(500,
                "Attributes not found",
                "Could not find any attributes to setup the new World"));
        }

        for (let i in rows) {
            if (!rows.hasOwnProperty(i)) continue;

            const payload = {
                world_id: id,
                attribute_id: parseInt(rows[i].id),
                value: parseInt(rows[i].minimum),
                minimum: parseInt(rows[i].minimum),
                maximum: parseInt(rows[i].maximum),
            };

            await SQLHelper.INSERT('world_has_attribute', { ...payload });
        }

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
