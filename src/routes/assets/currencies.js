'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'currency';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'currency.id, ' +
        'currency.canon, ' +
        'currency.name, ' +
        'currency.description, ' +
        'currency.short, ' +
        'currency.exchange, ' +
        'currency.created, ' +
        'currency.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'currency_is_copy.copy_id AS copy__id ' +
        'FROM currency ' +
        'LEFT JOIN currency_is_copy ON currency_is_copy.currency_id = currency.id ' +
        'LEFT JOIN account ON account.id = currency.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
