'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'language';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'language.id, ' +
        'language.canon, ' +
        'language.name, ' +
        'language.description, ' +
        'language.created, ' +
        'language.updated, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'language_is_copy.copy_id AS copy__id ' +
        'FROM language ' +
        'LEFT JOIN language_is_copy ON language_is_copy.language_id = language.id ' +
        'LEFT JOIN account ON account.id = language.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
