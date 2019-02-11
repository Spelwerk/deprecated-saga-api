'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const manifestationResponseHelper = require('../../helpers/content/response-helper-manifestation');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'manifestation';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'manifestation.id, ' +
        'manifestation.canon, ' +
        'manifestation.name, ' +
        'manifestation.description, ' +
        'manifestation.icon, ' +
        'manifestation.created, ' +
        'manifestation.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'manifestation_is_copy.copy_id AS copy__id ' +
        'FROM manifestation ' +
        'LEFT JOIN manifestation_is_copy ON manifestation_is_copy.manifestation_id = manifestation.id ' +
        'LEFT JOIN account ON account.id = manifestation.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await manifestationResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);
    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
