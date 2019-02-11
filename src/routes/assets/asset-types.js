'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'asset_type';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'asset_type.id, ' +
        'asset_type.canon, ' +
        'asset_type.name, ' +
        'asset_type.icon, ' +
        'asset_type.created, ' +
        'asset_type.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'asset_type_is_copy.copy_id AS copy__id ' +
        'FROM asset_type ' +
        'LEFT JOIN asset_type_is_copy ON asset_type_is_copy.asset_type_id = asset_type.id ' +
        'LEFT JOIN account ON account.id = asset_type.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
