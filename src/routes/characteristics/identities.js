'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'identity';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'identity.id, ' +
        'identity.canon, ' +
        'identity.name, ' +
        'identity.description, ' +
        'identity.icon, ' +
        'identity.created, ' +
        'identity.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'identity_is_copy.copy_id AS copy__id ' +
        'FROM identity ' +
        'LEFT JOIN identity_is_copy ON identity_is_copy.identity_id = identity.id ' +
        'LEFT JOIN account ON account.id = identity.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
