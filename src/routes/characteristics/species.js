'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const speciesResponseHelper = require('../../helpers/content/response-helper-species');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'species';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'species.id, ' +
        'species.canon, ' +
        'species.name, ' +
        'species.description, ' +
        'species.history, ' +
        'species.icon, ' +
        'species.is_playable AS isPlayable, ' +
        'species.can_magic AS canMagic, ' +
        'species.max_age AS maxAge, ' +
        'species.multiply_points AS points__multiply, ' +
        'species.created, ' +
        'species.updated, ' +
        'world.id AS world__id, ' +
        'world.name AS world__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'species_is_copy.copy_id AS copy__id ' +
        'FROM species ' +
        'LEFT JOIN species_is_copy ON species_is_copy.species_id = species.id ' +
        'LEFT JOIN world ON world.id = species.world_id ' +
        'LEFT JOIN account ON account.id = species.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await speciesResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/world/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE deleted = 0 AND ' +
                'world_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
