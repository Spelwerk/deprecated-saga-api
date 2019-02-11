'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'focus';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'focus.id, ' +
        'focus.canon, ' +
        'focus.name, ' +
        'focus.description, ' +
        'focus.icon, ' +
        'focus.created, ' +
        'focus.updated, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name As manifestation__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'focus_is_copy.copy_id AS copy__id ' +
        'FROM focus ' +
        'LEFT JOIN focus_is_copy ON focus_is_copy.focus_id = focus.id ' +
        'LEFT JOIN manifestation ON manifestation.id = focus.manifestation_id ' +
        'LEFT JOIN account ON account.id = focus.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE focus.deleted = 0 AND ' +
                'focus.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
