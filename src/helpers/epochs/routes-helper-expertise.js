'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRouteHelper = require('../common/route-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const expertisesRoute = (router) => {
    const table = 'epoch';
    const relation = 'expertise';
    const query = 'SELECT ' +
        'expertise.id, ' +
        'expertise.name, ' +
        'expertise.description, ' +
        'skill.icon, ' +
        'skill.id AS skill__id, ' +
        'skill.name AS skill__name, ' +
        'expertise.skill_requirement AS skill__requirement, ' +
        'expertise.skill_dice AS skill__dice, ' +
        'expertise.skill_bonus AS skill__bonus ' +
        'FROM epoch_has_expertise ' +
        'LEFT JOIN expertise ON expertise.id = epoch_has_expertise.expertise_id ' +
        'LEFT JOIN skill ON skill.id = expertise.skill_id ' +
        'LEFT JOIN expertise_is_manifestation ON expertise_is_manifestation.expertise_id = expertise.id ' +
        'LEFT JOIN expertise_is_species ON expertise_is_species.expertise_id = expertise.id ' +
        'LEFT JOIN manifestation ON manifestation.id = expertise_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = expertise_is_species.species_id';

    relationRouteHelper.relationRootGet(router, table, relation, query);
    relationRouteHelper.relationRootPost(router, table, relation);

    router.route('/:id/expertises/skill/:skill')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'expertise.deleted = 0 ' +
                'epoch_has_expertise.epoch_id = ? AND ' +
                'expertise.skill_id = ? AND ' +
                'expertise_is_manifestation.manifestation_id IS NULL AND ' +
                'expertise_is_species.species_id IS NULL';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.skill]);
        });

    router.route('/:id/expertises/skill/:skill/manifestation/:manifestation')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'expertise.deleted = 0 ' +
                'epoch_has_expertise.epoch_id = ? AND ' +
                'expertise.skill_id = ? AND ' +
                'expertise_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.skill, req.params.manifestation]);
        });

    router.route('/:id/expertises/skill/:skill/species/:species')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'expertise.deleted = 0 ' +
                'epoch_has_expertise.epoch_id = ? AND ' +
                'expertise.skill_id = ? AND ' +
                'expertise_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.skill, req.params.species]);
        });

    relationRouteHelper.relationIdGet(router, table, relation, query);
    relationRouteHelper.relationIdPut(router, table, relation);
    relationRouteHelper.relationIdDelete(router, table, relation);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = expertisesRoute;
