'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const weaponTypeResponseHelper = require('../../helpers/content/response-helper-weapon-type');

module.exports = (router) => {
    const table = 'weapon_type';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'weapon_type.id, ' +
        'weapon_type.canon, ' +
        'weapon_type.name, ' +
        'weapon_type.description, ' +
        'weapon_type.icon, ' +
        'weapon_type.can_equip AS canEquip, ' +
        'weapon_type.is_augmentation AS isAugmentation, ' +
        'weapon_type.is_manifestation AS isManifestation, ' +
        'weapon_type.is_form AS isForm, ' +
        'weapon_type.is_species AS isSpecies, ' +
        'weapon_type.created, ' +
        'weapon_type.updated, ' +
        'attribute.id AS damage__id, ' +
        'attribute.name AS damage__name, ' +
        'expertise.id AS expertise__id, ' +
        'expertise.name AS expertise__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'weapon_type_is_copy.copy_id AS copy__id ' +
        'FROM weapon_type ' +
        'LEFT JOIN weapon_type_is_copy ON weapon_type_is_copy.weapon_type_id = weapon_type.id ' +
        'LEFT JOIN attribute ON attribute.id = weapon_type.attribute_id ' +
        'LEFT JOIN expertise ON expertise.id = weapon_type.expertise_id ' +
        'LEFT JOIN account ON account.id = weapon_type.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await weaponTypeResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/augmentation/:boolean')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE weapon_type.deleted = 0 AND ' +
                'augmentation = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.boolean]);
        });

    router.route('/damage/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE weapon_type.deleted = 0 AND ' +
                'attribute_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/expertise/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE weapon_type.deleted = 0 AND ' +
                'expertise_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/form/:boolean')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE weapon_type.deleted = 0 AND ' +
                'form = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.boolean]);
        });

    router.route('/manifestation/:boolean')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE weapon_type.deleted = 0 AND ' +
                'manifestation = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.boolean]);
        });

    router.route('/species/:boolean')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE weapon_type.deleted = 0 AND ' +
                'species = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.boolean]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
