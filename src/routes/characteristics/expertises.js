'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'expertise';
    const queryRoot = 'SELECT ' +
        'expertise.id, ' +
        'expertise.canon, ' +
        'expertise.name, ' +
        'skill.icon, ' +
        'expertise.created, ' +
        'expertise.updated ' +
        'FROM expertise ' +
        'LEFT JOIN skill ON skill.id = expertise.skill_id';
    const queryId = 'SELECT ' +
        'expertise.id, ' +
        'expertise.canon, ' +
        'expertise.name, ' +
        'expertise.description, ' +
        'skill.icon, ' +
        'expertise.created, ' +
        'expertise.updated, ' +
        'skill.id AS skill__id, ' +
        'skill.name AS skill__name, ' +
        'expertise.skill_requirement AS skill__requirement, ' +
        'expertise.skill_dice AS skill__dice, ' +
        'expertise.skill_bonus AS skill__bonus, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'expertise_is_copy.copy_id AS copy__id ' +
        'FROM expertise ' +
        'LEFT JOIN expertise_is_manifestation ON expertise_is_manifestation.expertise_id = expertise.id ' +
        'LEFT JOIN expertise_is_species ON expertise_is_species.expertise_id = expertise.id ' +
        'LEFT JOIN expertise_is_copy ON expertise_is_copy.expertise_id = expertise.id ' +
        'LEFT JOIN skill ON skill.id = expertise.skill_id ' +
        'LEFT JOIN manifestation ON manifestation.id = expertise_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = expertise_is_species.species_id ' +
        'LEFT JOIN account ON account.id = expertise.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN expertise_is_manifestation ON expertise_is_manifestation.expertise_id = expertise.id ' +
                'WHERE ' +
                'expertise.deleted = 0 AND ' +
                'expertise_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/skill/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'WHERE ' +
                'expertise.deleted = 0 AND ' +
                'expertise.skill_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/species/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN expertise_is_species ON expertise_is_species.expertise_id = expertise.id ' +
                'WHERE ' +
                'expertise.deleted = 0 AND ' +
                'expertise_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/skill/:skill/manifestation/:manifestation')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN expertise_is_manifestation ON expertise_is_manifestation.expertise_id = expertise.id ' +
                'WHERE ' +
                'expertise.deleted = 0 AND ' +
                'expertise.skill_id = ? AND ' +
                'expertise_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.skill, req.params.manifestation]);
        });

    router.route('/skill/:skill/species/:species')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN expertise_is_species ON expertise_is_species.expertise_id = expertise.id ' +
                'WHERE ' +
                'expertise.deleted = 0 AND ' +
                'expertise.skill_id = ? AND ' +
                'expertise_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.skill, req.params.species]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
