'use strict';

const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');
const epochsRelationRouteHelper = require('../../helpers/epochs');

module.exports = (router) => {
    const table = 'epoch';
    const queryRoot = `SELECT id, canon, name, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'epoch.id, ' +
        'epoch.canon, ' +
        'epoch.name, ' +
        'epoch.description, ' +
        'epoch.history, ' +
        'epoch.begins, ' +
        'epoch.ends, ' +
        'epoch.has_augmentation AS hasAugmentation, ' +
        'epoch.created, ' +
        'epoch.updated, ' +
        'world.id AS world__id, ' +
        'world.name AS world__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'epoch_is_copy.copy_id AS copy__id ' +
        'FROM epoch ' +
        'LEFT JOIN epoch_is_copy ON epoch_is_copy.epoch_id = epoch.id ' +
        'LEFT JOIN world ON world.id = epoch.world_id ' +
        'LEFT JOIN account ON account.id = epoch.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);

    relationRouteHelper.relationRoute(router, table, 'asset');
    relationRouteHelper.relationRoute(router, table, 'bionic');
    relationRouteHelper.relationRoute(router, table, 'corporation');
    relationRouteHelper.relationRoute(router, table, 'country');
    relationRouteHelper.relationRoute(router, table, 'location');
    relationRouteHelper.relationRoute(router, table, 'shield');
    relationRouteHelper.relationRoute(router, table, 'skill');
    relationRouteHelper.relationRoute(router, table, 'software');
    relationRouteHelper.relationRoute(router, table, 'wealth');

    epochsRelationRouteHelper.armour(router);
    epochsRelationRouteHelper.background(router);
    epochsRelationRouteHelper.expertise(router);
    epochsRelationRouteHelper.gift(router);
    epochsRelationRouteHelper.imperfection(router);
    epochsRelationRouteHelper.manifestation(router);
    epochsRelationRouteHelper.milestone(router);
    epochsRelationRouteHelper.weapon(router);
};
