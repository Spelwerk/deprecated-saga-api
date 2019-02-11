'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRouteHelper = require('../common/route-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const giftsRoute = (router) => {
    const table = 'epoch';
    const relation = 'gift';
    const query = 'SELECT ' +
        'gift.id, ' +
        'gift.name, ' +
        'gift.description, ' +
        'gift.icon, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id,' +
        'species.name AS species__name ' +
        'FROM epoch_has_gift ' +
        'LEFT JOIN gift ON gift.id = epoch_has_gift.gift_id ' +
        'LEFT JOIN gift_is_manifestation ON gift_is_manifestation.gift_id = gift.id ' +
        'LEFT JOIN gift_is_species ON gift_is_species.gift_id = gift.id ' +
        'LEFT JOIN manifestation ON manifestation.id = gift_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = gift_is_species.species_id';

    relationRouteHelper.relationRootGet(router, table, relation, query);
    relationRouteHelper.relationRootPost(router, table, relation);

    router.route('/:id/gifts/default')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'gift.deleted = 0 AND ' +
                'epoch_has_gift.epoch_id = ? AND ' +
                'gift_is_manifestation.manifestation_id IS NULL AND ' +
                'gift_is_species.species_id IS NULL';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/:id/gifts/manifestation/:manifestation')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'gift.deleted = 0 AND ' +
                'epoch_has_gift.epoch_id = ? AND ' +
                'gift_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.manifestation]);
        });

    router.route('/:id/gifts/species/:species')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'gift.deleted = 0 AND ' +
                'epoch_has_gift.epoch_id = ? AND ' +
                'gift_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.species]);
        });

    relationRouteHelper.relationIdGet(router, table, relation, query);
    relationRouteHelper.relationIdPut(router, table, relation);
    relationRouteHelper.relationIdDelete(router, table, relation);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = giftsRoute;

