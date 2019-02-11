'use strict';

const genericResponseHelper = require('../helpers/common/response-helper-generic');
const genericRouteHelper = require('../helpers/common/route-helper-generic');
const creatureResponseHelper = require('../helpers/creatures/response-helper-creature');

const combinationRouteHelper = require('../helpers/creatures/routes-helper-combination');
const relationRouteHelper = require('../helpers/creatures/routes-helper-relation');
const woundRouteHelper = require('../helpers/creatures/routes-helper-wound');

module.exports = (router) => {
    const table = 'creature';
    const queryRoot = 'SELECT ' +
        'creature.id, ' +
        'creature.canon, ' +
        'creature.is_template AS isTemplate, ' +
        'creature.name_nick AS name__nick, ' +
        'creature.name_first AS name__first, ' +
        'creature.name_last AS name__last, ' +
        'creature.age, ' +
        'creature.gender, ' +
        'creature.occupation, ' +
        'creature.created, ' +
        'creature.updated, ' +
        'creature_type.id AS type__id, ' +
        'creature_type.name AS type__name ' +
        'FROM creature ' +
        'LEFT JOIN creature_type ON creature_type.id = creature.creature_type_id';
    const queryId = 'SELECT ' +
        'creature.id, ' +
        'creature.canon, ' +
        'creature.is_template AS isTemplate, ' +
        'creature.name_nick AS name__nick, ' +
        'creature.name_first AS name__first, ' +
        'creature.name_middle AS name__middle, ' +
        'creature.name_last AS name__last, ' +
        'creature.age, ' +
        'creature.gender, ' +
        'creature.occupation, ' +
        'creature.appearance, ' +
        'creature.biography, ' +
        'creature.bonds, ' +
        'creature.drive, ' +
        'creature.ideals, ' +
        'creature.personality, ' +
        'creature.pride, ' +
        'creature.problem, ' +
        'creature.shame, ' +
        'creature.created, ' +
        'creature.updated, ' +
        'creature_type.id AS type__id, ' +
        'creature_type.name AS type__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'creature_is_copy.copy_id AS copy__id ' +
        'FROM creature ' +
        'LEFT JOIN creature_type ON creature_type.id = creature.creature_type_id ' +
        'LEFT JOIN creature_is_copy ON creature_is_copy.creature_id = creature.id ' +
        'LEFT JOIN account ON account.id = creature.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await creatureResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/templates')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE ' +
                'creature.deleted = 0 AND ' +
                'creature.canon = 1 AND ' +
                'creature.is_template = 1';

            await genericResponseHelper.GET(req, res, next, call);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);

    combinationRouteHelper.corporationRoutes(router);
    combinationRouteHelper.countryRoutes(router);
    combinationRouteHelper.epochRoutes(router);
    combinationRouteHelper.identityRoutes(router);
    combinationRouteHelper.natureRoutes(router);
    combinationRouteHelper.speciesRoutes(router);
    combinationRouteHelper.wealthRoutes(router);
    combinationRouteHelper.worldRoutes(router);

    relationRouteHelper.armourRoutes(router);
    relationRouteHelper.assetRoutes(router);
    relationRouteHelper.attributeRoutes(router);
    relationRouteHelper.backgroundRoutes(router);
    relationRouteHelper.bionicRoutes(router);
    relationRouteHelper.currencyRoutes(router);
    relationRouteHelper.expertiseRoutes(router);
    relationRouteHelper.formRoutes(router);
    relationRouteHelper.giftRoutes(router);
    relationRouteHelper.imperfectionRoutes(router);
    relationRouteHelper.languageRoutes(router);
    relationRouteHelper.loyaltyRoutes(router);
    relationRouteHelper.manifestationRoutes(router);
    relationRouteHelper.milestoneRoutes(router);
    relationRouteHelper.primalRoutes(router);
    relationRouteHelper.relationRoutes(router);
    relationRouteHelper.shieldRoutes(router);
    relationRouteHelper.skillRoutes(router);
    relationRouteHelper.spellRoutes(router);
    relationRouteHelper.softwareRoutes(router);
    relationRouteHelper.tacticRoutes(router);
    relationRouteHelper.weaponRoutes(router);

    woundRouteHelper.dementationsRoutes(router);
    woundRouteHelper.diseasesRoutes(router);
    woundRouteHelper.traumasRoutes(router);
};
