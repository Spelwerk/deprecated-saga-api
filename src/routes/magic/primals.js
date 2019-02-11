'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const primalResponseHelper = require('../../helpers/content/response-helper-primal');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'primal';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'primal.id, ' +
        'primal.canon, ' +
        'primal.name, ' +
        'primal.description, ' +
        'primal.effects, ' +
        'primal.icon, ' +
        'primal.maximum, ' +
        'primal.created, ' +
        'primal.updated, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'expertise.id AS expertise__id, ' +
        'expertise.name AS expertise__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'primal_is_copy.copy_id AS copy__id ' +
        'FROM primal ' +
        'LEFT JOIN primal_is_copy ON primal_is_copy.primal_id = primal.id ' +
        'LEFT JOIN manifestation ON manifestation.id = primal.manifestation_id ' +
        'LEFT JOIN expertise ON expertise.id = primal.expertise_id ' +
        'LEFT JOIN account ON account.id = primal.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await primalResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE primal.deleted = 0 AND ' +
                'manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
