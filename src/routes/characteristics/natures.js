'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'nature';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'nature.id, ' +
        'nature.canon, ' +
        'nature.name, ' +
        'nature.description, ' +
        'nature.icon, ' +
        'nature.created, ' +
        'nature.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'nature_is_copy.copy_id AS copy__id ' +
        'FROM nature ' +
        'LEFT JOIN nature_is_copy ON nature_is_copy.nature_id = nature.id ' +
        'LEFT JOIN account ON account.id = nature.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
