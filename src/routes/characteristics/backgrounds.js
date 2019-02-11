'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'background';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'background.id, ' +
        'background.canon, ' +
        'background.name, ' +
        'background.description, ' +
        'background.icon, ' +
        'background.created, ' +
        'background.updated, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'background_is_copy.copy_id AS copy__id ' +
        'FROM background ' +
        'LEFT JOIN background_is_manifestation ON background_is_manifestation.background_id = background.id ' +
        'LEFT JOIN background_is_species ON background_is_species.background_id = background.id ' +
        'LEFT JOIN background_is_copy ON background_is_copy.background_id = background.id ' +
        'LEFT JOIN manifestation ON manifestation.id = background_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = background_is_species.species_id ' +
        'LEFT JOIN account ON account.id = background.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN background_is_manifestation ON background_is_manifestation.background_id = background.id ' +
                'WHERE ' +
                'background.deleted = 0 AND ' +
                'background_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/species/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN background_is_species ON background_is_species.background_id = background.id ' +
                'WHERE ' +
                'background.deleted = 0 AND ' +
                'background_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
