'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'software';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'software.id, ' +
        'software.canon, ' +
        'software.name, ' +
        'software.description, ' +
        'software.is_legal AS isLegal, ' +
        'software.price, ' +
        'software.hacking_difficulty AS hacking__difficulty, ' +
        'software.hacking_bonus AS hacking__bonus, ' +
        'software.created, ' +
        'software.updated, ' +
        'software_type.id AS type__id, ' +
        'software_type.name AS type__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'software_is_copy.copy_id ' +
        'FROM software ' +
        'LEFT JOIN software_is_copy ON software_is_copy.software_id = software.id ' +
        'LEFT JOIN software_type ON software_type.id = software.software_type_id ' +
        'LEFT JOIN account ON account.id = software.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/type/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE deleted = 0 AND ' +
                'software.software_type_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
