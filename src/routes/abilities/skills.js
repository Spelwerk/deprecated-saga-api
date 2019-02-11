'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const skillResponseHelper = require('../../helpers/content/response-helper-skill');

module.exports = (router) => {
    const table = 'skill';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'skill.id, ' +
        'skill.canon, ' +
        'skill.name, ' +
        'skill.description, ' +
        'skill.icon, ' +
        'skill.is_optional AS isOptional, ' +
        'skill.maximum, ' +
        'skill.created, ' +
        'skill.updated, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'skill_is_copy.copy_id AS copy__id ' +
        'FROM skill ' +
        'LEFT JOIN skill_is_manifestation ON skill_is_manifestation.skill_id = skill.id ' +
        'LEFT JOIN skill_is_species ON skill_is_species.skill_id = skill.id ' +
        'LEFT JOIN skill_is_copy ON skill_is_copy.skill_id = skill.id ' +
        'LEFT JOIN manifestation ON manifestation.id = skill_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = skill_is_species.species_id ' +
        'LEFT JOIN account ON account.id = skill.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await skillResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN skill_is_manifestation ON skill_is_manifestation.skill_id = skill.id ' +
                'WHERE ' +
                'skill.deleted = 0 AND ' +
                'skill_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/species/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN skill_is_species ON skill_is_species.skill_id = skill.id ' +
                'WHERE ' +
                'skill.deleted = 0 AND ' +
                'skill_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
