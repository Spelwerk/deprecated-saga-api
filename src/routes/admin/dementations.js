'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');

module.exports = (router) => {
    const table = 'dementation';
    const queryRoot = `SELECT id, name FROM ${table}`;
    const queryId = `SELECT * FROM ${table}`;

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
