'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'bionic';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'bionic.id, ' +
        'bionic.canon, ' +
        'bionic.name, ' +
        'bionic.description, ' +
        'bionic.icon, ' +
        'bionic.is_legal AS isLegal, ' +
        'bionic.price, ' +
        'bionic.hacking_difficulty AS hacking__difficulty, ' +
        'bionic.created, ' +
        'bionic.updated, ' +
        'body_part.id AS bodyPart__id, ' +
        'body_part.name AS bodyPart__name, ' +
        'corporation.id AS corporation__id, ' +
        'corporation.name AS corporation__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'bionic_is_copy.copy_id AS copy__id ' +
        'FROM bionic ' +
        'LEFT JOIN bionic_is_corporation ON bionic_is_corporation.bionic_id = bionic.id ' +
        'LEFT JOIN bionic_is_copy ON bionic_is_copy.bionic_id = bionic.id ' +
        'LEFT JOIN body_part ON body_part.id = bionic.body_part_id ' +
        'LEFT JOIN corporation ON corporation.id = bionic_is_corporation.corporation_id ' +
        'LEFT JOIN account ON account.id = bionic.account_id';

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
