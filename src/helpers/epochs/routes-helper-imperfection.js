'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRouteHelper = require('../common/route-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const imperfectionsRoute = (router) => {
    const table = 'epoch';
    const relation = 'imperfection';
    const query = 'SELECT ' +
        'imperfection.id, ' +
        'imperfection.name, ' +
        'imperfection.description, ' +
        'imperfection.icon, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id,' +
        'species.name AS species__name ' +
        'FROM epoch_has_imperfection ' +
        'LEFT JOIN imperfection ON imperfection.id = epoch_has_imperfection.imperfection_id ' +
        'LEFT JOIN imperfection_is_manifestation ON imperfection_is_manifestation.imperfection_id = imperfection.id ' +
        'LEFT JOIN imperfection_is_species ON imperfection_is_species.imperfection_id = imperfection.id ' +
        'LEFT JOIN manifestation ON manifestation.id = imperfection_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = imperfection_is_species.species_id';

    relationRouteHelper.relationRootGet(router, table, relation, query);
    relationRouteHelper.relationRootPost(router, table, relation);

    router.route('/:id/imperfections/default')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'imperfection.deleted = 0 AND ' +
                'epoch_has_imperfection.epoch_id = ? AND ' +
                'imperfection_is_manifestation.manifestation_id IS NULL AND ' +
                'imperfection_is_species.species_id IS NULL';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/:id/imperfections/manifestation/:manifestation')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'imperfection.deleted = 0 AND ' +
                'epoch_has_imperfection.epoch_id = ? AND ' +
                'imperfection_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.manifestation]);
        });

    router.route('/:id/imperfections/species/:species')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'imperfection.deleted = 0 AND ' +
                'epoch_has_imperfection.epoch_id = ? AND ' +
                'imperfection_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.species]);
        });

    relationRouteHelper.relationIdGet(router, table, relation, query);
    relationRouteHelper.relationIdPut(router, table, relation);
    relationRouteHelper.relationIdDelete(router, table, relation);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = imperfectionsRoute;
