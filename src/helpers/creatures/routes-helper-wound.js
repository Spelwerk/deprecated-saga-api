'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRequestHelper = require('../common/request-helper-relation');
const uniqueIdSQLHelper = require('../common/response-helper-relation-unique-id');
const { Plural } = require('../../constants');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const woundRoutes = (router, relation) => {
    const table = 'creature';
    const route = Plural[table];
    const creature_has_relation = `creature_has_${relation}`;
    const relation_id = `${relation}_id`;
    const query = `SELECT * FROM ${creature_has_relation} WHERE creature_id = ?`;

    router.route(`/:id/${route}`)
        .get(async (req, res, next) => {
            await genericResponseHelper.GET(req, res, next, query, [req.params.id]);
        })
        .post(async (req, res, next) => {
            try {
                await relationRequestHelper.INSERT(req, table, relation, req.params.id);
                res.status(201).send();
            } catch (e) {
                return next(e);
            }
        });

    router.route(`/:id/${route}/:unique`)
        .get(async (req, res, next) => {
            const call = query + ` AND ${relation_id} = ?`;
            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.unique]);
        })
        .put(async (req, res, next) => {
            try {
                await uniqueIdSQLHelper.UPDATE(req, req.params.id, relation, req.params.unique);
                res.status(204).send();
            } catch (e) {
                return next(e);
            }
        })
        .delete(async (req, res, next) => {
            try {
                await uniqueIdSQLHelper.DELETE(req, req.params.id, relation, req.params.unique);
                res.status(204).send();
            } catch (e) {
                return next(e);
            }
        });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const dementationsRoutes = (router) => {
    woundRoutes(router, 'dementation');
};

const diseasesRoutes = (router) => {
    woundRoutes(router, 'disease');
};

const traumasRoutes = (router) => {
    woundRoutes(router, 'trauma');
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    dementationsRoutes,
    diseasesRoutes,
    traumasRoutes,
};
