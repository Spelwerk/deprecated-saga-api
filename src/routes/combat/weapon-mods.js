'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'weapon_mod';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'weapon_mod.id, ' +
        'weapon_mod.canon, ' +
        'weapon_mod.name, ' +
        'weapon_mod.description, ' +
        'weapon_mod.icon, ' +
        'weapon_mod.short, ' +
        'weapon_mod.price, ' +
        'weapon_mod.hit, ' +
        'weapon_mod.hands, ' +
        'weapon_mod.distance, ' +
        'weapon_mod.created, ' +
        'weapon_mod.updated, ' +
        'weapon_mod.damage_dice AS damage__dice, ' +
        'weapon_mod.damage_bonus AS damage__bonus, ' +
        'weapon_mod.critical_dice AS critical__dice, ' +
        'weapon_mod.critical_bonus AS critical__bonus, ' +
        'corporation.id AS corporation__id, ' +
        'corporation.name AS corporation__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'weapon_mod_is_copy.copy_id AS copy__id ' +
        'FROM weapon_mod ' +
        'LEFT JOIN weapon_mod_is_corporation ON weapon_mod_is_corporation.weapon_mod_id = weapon_mod.id ' +
        'LEFT JOIN weapon_mod_is_copy ON weapon_mod_is_copy.weapon_mod_id = weapon_mod.id ' +
        'LEFT JOIN corporation ON corporation.id = weapon_mod_is_corporation.corporation_id ' +
        'LEFT JOIN account ON account.id = weapon_mod.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/weapon/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN weapon_has_weapon_mod ON weapon_has_weapon-mod.weapon_mod_id = weapon_mod.id ' +
                'WHERE weapon_has_weapon_mod.weapon_id = ? AND weapon-mod.deleted = 0';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
