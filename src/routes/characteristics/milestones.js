'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'milestone';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'milestone.id, ' +
        'milestone.canon, ' +
        'milestone.name, ' +
        'milestone.description, ' +
        'milestone.created, ' +
        'milestone.updated, ' +
        'background.id AS background__id, ' +
        'background.name AS background__name, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'milestone_is_copy.copy_id AS copy__id ' +
        'FROM milestone ' +
        'LEFT JOIN milestone_is_background ON milestone_is_background.milestone_id = milestone.id ' +
        'LEFT JOIN milestone_is_manifestation ON milestone_is_manifestation.milestone_id = milestone.id ' +
        'LEFT JOIN milestone_is_species ON milestone_is_species.milestone_id = milestone.id ' +
        'LEFT JOIN milestone_is_copy ON milestone_is_copy.milestone_id = milestone.id ' +
        'LEFT JOIN background ON background.id = milestone_is_background.background_id ' +
        'LEFT JOIN manifestation ON manifestation.id = milestone_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = milestone_is_species.species_id ' +
        'LEFT JOIN account ON account.id = milestone.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN milestone_is_manifestation ON milestone_is_manifestation.milestone_id = milestone.id ' +
                'WHERE ' +
                'milestone.deleted = 0 AND ' +
                'milestone_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/species/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN milestone_is_species ON milestone_is_species.milestone_id = milestone.id ' +
                'WHERE ' +
                'milestone.deleted = 0 AND ' +
                'milestone_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
