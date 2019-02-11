'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'body_part';
    const queryRoot = `SELECT id, canon, sort_order AS sortOrder, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'body_part.id, ' +
        'body_part.canon, ' +
        'body_part.sort_order AS sortOrder, ' +
        'body_part.name, ' +
        'body_part.description, ' +
        'body_part.weapon, ' +
        'body_part.created, ' +
        'body_part.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'body_part_is_copy.copy_id AS copy__id ' +
        'FROM body_part ' +
        'LEFT JOIN body_part_is_copy ON body_part_is_copy.body_part_id = body_part.id ' +
        'LEFT JOIN account ON account.id = body_part.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
