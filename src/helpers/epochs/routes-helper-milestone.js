'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRouteHelper = require('../common/route-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const milestonesRoute = (router) => {
    const table = 'epoch';
    const relation = 'milestone';
    const query = 'SELECT ' +
        'milestone.id, ' +
        'milestone.name, ' +
        'milestone.description, ' +
        'background.id AS background__id, ' +
        'background.name AS background__name, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name ' +
        'FROM epoch_has_milestone ' +
        'LEFT JOIN milestone ON milestone.id = epoch_has_milestone.milestone_id ' +
        'LEFT JOIN milestone_is_background ON milestone_is_background.milestone_id = milestone.id ' +
        'LEFT JOIN milestone_is_manifestation ON milestone_is_manifestation.milestone_id = milestone.id ' +
        'LEFT JOIN milestone_is_species ON milestone_is_species.milestone_id = milestone.id ' +
        'LEFT JOIN background ON background.id = milestone_is_background.background_id ' +
        'LEFT JOIN manifestation ON manifestation.id = milestone_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = milestone_is_species.species_id';

    relationRouteHelper.relationRootGet(router, table, relation, query);
    relationRouteHelper.relationRootPost(router, table, relation);

    router.route('/:id/milestones/default')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'milestone.deleted = 0 AND ' +
                'epoch_has_milestone.epoch_id = ? AND ' +
                'milestone_is_manifestation.manifestation_id IS NULL AND ' +
                'milestone_is_species.species_id IS NULL';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/:id/milestones/background/:background')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'milestone.deleted = 0 AND ' +
                'epoch_has_milestone.epoch_id = ? AND ' +
                'milestone_is_background.background_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.background]);
        });

    router.route('/:id/milestones/manifestation/:manifestation')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'milestone.deleted = 0 AND ' +
                'epoch_has_milestone.epoch_id = ? AND ' +
                'milestone_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.manifestation]);
        });

    router.route('/:id/milestones/species/:species')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'milestone.deleted = 0 AND ' +
                'epoch_has_milestone.epoch_id = ? AND ' +
                'milestone_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.species]);
        });

    relationRouteHelper.relationIdGet(router, table, relation, query);
    relationRouteHelper.relationIdPut(router, table, relation);
    relationRouteHelper.relationIdDelete(router, table, relation);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = milestonesRoute;
