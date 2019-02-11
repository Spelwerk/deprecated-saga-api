'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'tactic';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'tactic.id, ' +
        'tactic.canon, ' +
        'tactic.name, ' +
        'tactic.description, ' +
        'tactic.effects, ' +
        'tactic.icon, ' +
        'tactic.cost, ' +
        'tactic.created, ' +
        'tactic.updated, ' +
        'tactic.damage_dice AS damage__dice, ' +
        'tactic.damage_bonus AS damage__bonus, ' +
        'tactic.critical_dice AS critical__dice, ' +
        'tactic.critical_bonus AS critical__bonus, ' +
        'weapon_type.id AS type__id, ' +
        'weapon_type.name AS type__name, ' +
        'expertise.id AS expertise__id, ' +
        'expertise.name AS expertise__name, ' +
        'attribute.id AS damage__id, ' +
        'attribute.name AS damage__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'tactic_is_copy.copy_id AS copy__id ' +
        'FROM tactic ' +
        'LEFT JOIN tactic_is_copy ON tactic_is_copy.tactic_id = tactic.id ' +
        'LEFT JOIN weapon_type ON weapon_type.id = tactic.weapon_type_id ' +
        'LEFT JOIN expertise ON expertise.id = weapon_type.expertise_id ' +
        'LEFT JOIN attribute ON attribute.id = weapon_type.attribute_id ' +
        'LEFT JOIN account ON account.id = tactic.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
