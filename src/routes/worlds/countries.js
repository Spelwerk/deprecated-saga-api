'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'country';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'country.id, ' +
        'country.canon, ' +
        'country.name, ' +
        'country.description, ' +
        'country.created, ' +
        'country.updated, ' +
        'currency.id AS currency__id, ' +
        'currency.name AS currency__name, ' +
        'language.id AS language__id, ' +
        'language.name AS language__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'country_is_copy.copy_id AS copy__id ' +
        'FROM country ' +
        'LEFT JOIN country_is_currency ON country_is_currency.country_id = country.id ' +
        'LEFT JOIN country_is_language ON country_is_language.country_id = country.id ' +
        'LEFT JOIN country_is_copy ON country_is_copy.country_id = country.id ' +
        'LEFT JOIN currency ON currency.id = country_is_currency.currency_id ' +
        'LEFT JOIN language ON language.id = country_is_language.language_id ' +
        'LEFT JOIN account ON account.id = country.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
