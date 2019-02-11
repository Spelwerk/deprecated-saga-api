'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'location';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'location.id, ' +
        'location.canon, ' +
        'location.name, ' +
        'location.description, ' +
        'location.price, ' +
        'location.created, ' +
        'location.updated, ' +
        'country.id AS country__id, ' +
        'country.name AS country__name, ' +
        'creature.id AS creature__id, ' +
        'creature.name_first AS creature__firstName, ' +
        'creature.name_nick AS creature__nickName, ' +
        'creature.name_last AS creature__lastName, ' +
        'location_is_recursive.recursive_id AS recursive__id, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'location_is_copy.copy_id AS copy__id ' +
        'FROM location ' +
        'LEFT JOIN location_is_country ON location_is_country.location_id = location.id ' +
        'LEFT JOIN location_is_creature ON location_is_creature.location_id = location.id ' +
        'LEFT JOIN location_is_recursive ON location_is_recursive.location_id = location.id ' +
        'LEFT JOIN location_is_copy ON location_is_copy.location_id = location.id ' +
        'LEFT JOIN country ON country.id = location_is_country.country_id ' +
        'LEFT JOIN creature ON creature.id = location_is_creature.creature_id ' +
        'LEFT JOIN account ON account.id = location.account_id';

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
