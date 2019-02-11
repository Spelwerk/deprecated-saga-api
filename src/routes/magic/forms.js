'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const formResponseHelper = require('../../helpers/content/response-helper-form');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'form';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'form.id, ' +
        'form.canon, ' +
        'form.name, ' +
        'form.description, ' +
        'form.icon, ' +
        'form.appearance, ' +
        'form.created, ' +
        'form.updated, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name As manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name, ' +
        'expertise.id AS expertise__id, ' +
        'expertise.name AS expertise__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'form_is_copy.copy_id AS copy__id ' +
        'FROM form ' +
        'LEFT JOIN form_is_copy ON form_is_copy.form_id = form.id ' +
        'LEFT JOIN manifestation ON manifestation.id = form.manifestation_id ' +
        'LEFT JOIN species ON species.id = form.species_id ' +
        'LEFT JOIN expertise ON expertise.id = form.expertise_id ' +
        'LEFT JOIN account ON account.id = form.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await formResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE form.deleted = 0 AND ' +
                'manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
