'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRouteHelper = require('../common/route-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const manifestationsRoute = (router) => {
    const table = 'epoch';
    const relation = 'manifestation';
    const query = 'SELECT ' +
        'manifestation.id, ' +
        'manifestation.name, ' +
        'manifestation.description, ' +
        'manifestation.icon,' +
        'species.id AS species_id,' +
        'species.name AS species_name ' +
        'FROM epoch_has_manifestation ' +
        'LEFT JOIN manifestation ON manifestation.id = epoch_has_manifestation.manifestation_id ' +
        'LEFT JOIN manifestation_is_species ON manifestation_is_species.manifestation_id = manifestation.id ' +
        'LEFT JOIN species ON species.id = manifestation_is_species.species_id';

    relationRouteHelper.relationRootGet(router, table, relation, query);
    relationRouteHelper.relationRootPost(router, table, relation);

    router.route('/:id/manifestations/default')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'manifestation.deleted = 0 AND ' +
                'epoch_has_manifestation.epoch_id = ? AND ' +
                'manifestation_is_species.species_id IS NULL';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/:id/manifestations/species/:species')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'manifestation.deleted = 0 AND ' +
                'epoch_has_manifestation.epoch_id = ? AND ' +
                'manifestation_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.species]);
        });

    relationRouteHelper.relationIdGet(router, table, relation, query);
    relationRouteHelper.relationIdPut(router, table, relation);
    relationRouteHelper.relationIdDelete(router, table, relation);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = manifestationsRoute;
