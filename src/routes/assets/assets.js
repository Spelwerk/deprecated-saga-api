'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'asset';
    const queryRoot =  'SELECT ' +
        'asset.id, ' +
        'asset.canon, ' +
        'asset.name, ' +
        'asset_type.icon, ' +
        'asset.created, ' +
        'asset.updated ' +
        'FROM asset ' +
        'LEFT JOIN asset_type ON asset_type.id = asset.asset_type_id';
    const queryId = 'SELECT ' +
        'asset.id, ' +
        'asset.canon, ' +
        'asset.name, ' +
        'asset.description, ' +
        'asset_type.icon, ' +
        'asset.can_equip AS canEquip, ' +
        'asset.is_legal AS isLegal, ' +
        'asset.price, ' +
        'asset.is_heavy AS isHeavy, ' +
        'asset.created, ' +
        'asset.updated, ' +
        'asset_type.id AS type__id, ' +
        'asset_type.name AS type__name, ' +
        'corporation.id AS corporation__id, ' +
        'corporation.name AS corporation__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'asset_is_copy.copy_id AS copy__id ' +
        'FROM asset ' +
        'LEFT JOIN asset_is_corporation ON asset_is_corporation.asset_id = asset.id ' +
        'LEFT JOIN asset_is_copy ON asset_is_copy.asset_id = asset.id ' +
        'LEFT JOIN asset_type ON asset_type.id = asset.asset_type_id ' +
        'LEFT JOIN corporation ON corporation.id = asset_is_corporation.corporation_id ' +
        'LEFT JOIN account ON account.id = asset.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/type/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE asset.deleted = 0 AND ' +
                'asset.asset_type_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
