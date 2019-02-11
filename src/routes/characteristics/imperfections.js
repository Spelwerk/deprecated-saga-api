'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'imperfection';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'imperfection.id, ' +
        'imperfection.canon, ' +
        'imperfection.name, ' +
        'imperfection.description, ' +
        'imperfection.icon, ' +
        'imperfection.created, ' +
        'imperfection.updated, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'imperfection_is_copy.copy_id AS copy__id ' +
        'FROM imperfection ' +
        'LEFT JOIN imperfection_is_manifestation ON imperfection_is_manifestation.imperfection_id = imperfection.id ' +
        'LEFT JOIN imperfection_is_species ON imperfection_is_species.imperfection_id = imperfection.id ' +
        'LEFT JOIN imperfection_is_copy ON imperfection_is_copy.imperfection_id = imperfection.id ' +
        'LEFT JOIN manifestation ON manifestation.id = imperfection_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = imperfection_is_species.species_id ' +
        'LEFT JOIN account ON account.id = imperfection.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN imperfection_is_manifestation ON imperfection_is_manifestation.imperfection_id = imperfection.id ' +
                'WHERE ' +
                'imperfection.deleted = 0 AND ' +
                'imperfection_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/species/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN imperfection_is_species ON imperfection_is_species.imperfection_id = imperfection.id ' +
                'WHERE ' +
                'imperfection.deleted = 0 AND ' +
                'imperfection_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
