'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'wealth';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'wealth.id, ' +
        'wealth.canon, ' +
        'wealth.name, ' +
        'wealth.description, ' +
        'wealth.icon, ' +
        'wealth.created, ' +
        'wealth.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'wealth_is_copy.copy_id AS copy__id ' +
        'FROM wealth ' +
        'LEFT JOIN wealth_is_copy ON wealth_is_copy.wealth_id = wealth.id ' +
        'LEFT JOIN account ON account.id = wealth.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
