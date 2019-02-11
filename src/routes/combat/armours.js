'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'armour';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'armour.id, ' +
        'armour.canon, ' +
        'armour.name, ' +
        'armour.description, ' +
        'armour.icon, ' +
        'armour.price, ' +
        'armour.is_heavy AS isHeavy, ' +
        'armour.created, ' +
        'armour.updated, ' +
        'body_part.id AS bodyPart__id, ' +
        'body_part.name AS bodyPart__name, ' +
        'corporation.id AS corporation__id, ' +
        'corporation.name AS corporation__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'armour_is_copy.copy_id AS copy__id ' +
        'FROM armour ' +
        'LEFT JOIN armour_is_corporation ON armour_is_corporation.armour_id = armour.id ' +
        'LEFT JOIN armour_is_copy ON armour_is_copy.armour_id = armour.id ' +
        'LEFT JOIN body_part ON body_part.id = armour.body_part_id ' +
        'LEFT JOIN corporation ON corporation.id = armour_is_corporation.corporation_id ' +
        'LEFT JOIN account ON account.id = armour.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/body-part/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE deleted = 0 AND ' +
                'body_part_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
