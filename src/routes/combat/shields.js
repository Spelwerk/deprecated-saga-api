'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'shield';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'shield.id, ' +
        'shield.canon, ' +
        'shield.name, ' +
        'shield.description, ' +
        'shield.icon, ' +
        'shield.price, ' +
        'shield.is_heavy AS isHeavy, ' +
        'shield.created, ' +
        'shield.updated, ' +
        'shield.damage_dice AS damage__dice, ' +
        'shield.damage_bonus AS damage__bonus, ' +
        'shield.critical_dice AS critical__dice, ' +
        'shield.critical_bonus AS critical__bonus, ' +
        'attribute.id AS damage__id, ' +
        'attribute.name AS damage__name, ' +
        'expertise.id AS expertise__id, ' +
        'expertise.name AS expertise__name, ' +
        'corporation.id AS corporation__id, ' +
        'corporation.name AS corporation__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'shield_is_copy.copy_id AS copy__id ' +
        'FROM shield ' +
        'LEFT JOIN shield_is_corporation ON shield_is_corporation.shield_id = shield.id ' +
        'LEFT JOIN shield_is_copy ON shield_is_copy.shield_id = shield.id ' +
        'LEFT JOIN attribute ON attribute.id = shield.attribute_id ' +
        'LEFT JOIN expertise ON expertise.id = shield.expertise_id ' +
        'LEFT JOIN corporation ON corporation.id = shield_is_corporation.corporation_id ' +
        'LEFT JOIN account ON account.id = shield.account_id';

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
