'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'gift';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'gift.id, ' +
        'gift.canon, ' +
        'gift.name, ' +
        'gift.description, ' +
        'gift.icon, ' +
        'gift.created, ' +
        'gift.updated, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'gift_is_copy.copy_id AS copy__id ' +
        'FROM gift ' +
        'LEFT JOIN gift_is_manifestation ON gift_is_manifestation.gift_id = gift.id ' +
        'LEFT JOIN gift_is_species ON gift_is_species.gift_id = gift.id ' +
        'LEFT JOIN gift_is_copy ON gift_is_copy.gift_id = gift.id ' +
        'LEFT JOIN manifestation ON manifestation.id = gift_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = gift_is_species.species_id ' +
        'LEFT JOIN account ON account.id = gift.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN gift_is_manifestation ON gift_is_manifestation.gift_id = gift.id ' +
                'WHERE ' +
                'gift.deleted = 0 AND ' +
                'gift_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/species/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN gift_is_species ON gift_is_species.gift_id = gift.id ' +
                'WHERE ' +
                'gift.deleted = 0 AND ' +
                'gift_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
