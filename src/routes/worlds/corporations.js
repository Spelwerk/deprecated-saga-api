'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'corporation';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'corporation.id, ' +
        'corporation.canon, ' +
        'corporation.name, ' +
        'corporation.description, ' +
        'corporation.created, ' +
        'corporation.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'corporation_is_copy.copy_id AS copy__id ' +
        'FROM corporation ' +
        'LEFT JOIN corporation_is_copy ON corporation_is_copy.corporation_id = corporation.id ' +
        'LEFT JOIN account ON account.id = corporation.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
