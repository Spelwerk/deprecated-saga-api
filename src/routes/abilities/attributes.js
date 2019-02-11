'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'attribute';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'attribute.id, ' +
        'attribute.canon, ' +
        'attribute.name, ' +
        'attribute.description, ' +
        'attribute.icon, ' +
        'attribute.is_optional AS isOptional, ' +
        'attribute.minimum, ' +
        'attribute.maximum, ' +
        'attribute.created, ' +
        'attribute.updated, ' +
        'attribute_type.id AS type__id, ' +
        'attribute_type.name AS type__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'attribute_is_copy.copy_id AS copy__id ' +
        'FROM attribute ' +
        'LEFT JOIN attribute_is_copy ON attribute_is_copy.attribute_id = attribute.id ' +
        'LEFT JOIN attribute_type ON attribute_type.id = attribute.attribute_type_id ' +
        'LEFT JOIN account ON account.id = attribute.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/type/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE deleted = 0 AND ' +
                'attribute_type_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
