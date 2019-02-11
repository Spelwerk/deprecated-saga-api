'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');
const augmentationResponseHelper = require('../../helpers/content/response-helper-augmentation');

module.exports = (router) => {
    const table = 'augmentation';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'augmentation.id, ' +
        'augmentation.canon, ' +
        'augmentation.name, ' +
        'augmentation.description, ' +
        'augmentation.is_legal AS isLegal, ' +
        'augmentation.price, ' +
        'augmentation.hacking_difficulty AS hacking__difficulty, ' +
        'augmentation.created, ' +
        'augmentation.updated, ' +
        'corporation.id AS corporation__id, ' +
        'corporation.name AS corporation__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'augmentation_is_copy.copy_id AS copy__id ' +
        'FROM augmentation ' +
        'LEFT JOIN augmentation_is_corporation ON augmentation_is_corporation.augmentation_id = augmentation.id ' +
        'LEFT JOIN augmentation_is_copy ON augmentation_is_copy.augmentation_id = augmentation.id ' +
        'LEFT JOIN corporation ON corporation.id = augmentation_is_corporation.corporation_id ' +
        'LEFT JOIN account ON account.id = augmentation.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await augmentationResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
