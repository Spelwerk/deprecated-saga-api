'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const worldResponseHelper = require('../../helpers/content/response-helper-world');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'world';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'world.id, ' +
        'world.canon, ' +
        'world.is_template AS isTemplate, ' +
        'world.name, ' +
        'world.description, ' +
        'world.min_age AS minimumAge, ' +
        'world.created, ' +
        'world.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'world_is_copy.copy_id AS copy__id ' +
        'FROM world ' +
        'LEFT JOIN world_is_copy ON world_is_copy.world_id = world.id ' +
        'LEFT JOIN account ON account.id = world.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await worldResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
