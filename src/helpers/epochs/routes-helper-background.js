'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRouteHelper = require('../common/route-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const backgroundsRoute = (router) => {
    const table = 'epoch';
    const relation = 'background';
    const query = 'SELECT ' +
        'background.id, ' +
        'background.name, ' +
        'background.description, ' +
        'background.icon, ' +
        'manifestation.id AS manifestation__id,' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name ' +
        'FROM epoch_has_background ' +
        'LEFT JOIN background ON background.id = epoch_has_background.background_id ' +
        'LEFT JOIN background_is_manifestation ON background_is_manifestation.background_id = background.id ' +
        'LEFT JOIN background_is_species ON background_is_species.background_id = background.id ' +
        'LEFT JOIN manifestation ON manifestation.id = background_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = background_is_species.species_id';

    relationRouteHelper.relationRootGet(router, table, relation, query);
    relationRouteHelper.relationRootPost(router, table, relation);

    router.route('/:id/backgrounds/default')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'background.deleted = 0 AND ' +
                'epoch_has_background.epoch_id = ? AND ' +
                'background_is_manifestation.manifestation_id IS NULL' +
                'background_is_species.species_id IS NULL AND ';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/:id/backgrounds/manifestation/:manifestation')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'background.deleted = 0 AND ' +
                'epoch_has_background.epoch_id = ? AND ' +
                'background_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.manifestation]);
        });

    router.route('/:id/backgrounds/species/:species')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'background.deleted = 0 AND ' +
                'epoch_has_background.epoch_id = ? AND ' +
                'background_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.species]);
        });

    relationRouteHelper.relationIdGet(router, table, relation, query);
    relationRouteHelper.relationIdPut(router, table, relation);
    relationRouteHelper.relationIdDelete(router, table, relation);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = backgroundsRoute;
