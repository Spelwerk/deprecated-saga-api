'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'weapon';
    const queryRoot = 'SELECT ' +
        'weapon.id, ' +
        'weapon.canon, ' +
        'weapon.name, ' +
        'weapon_type.icon, ' +
        'weapon.created,' +
        'weapon.updated ' +
        'FROM weapon ' +
        'LEFT JOIN weapon_type ON weapon_type.id = weapon.weapon_type_id';
    const queryId = 'SELECT ' +
        'weapon.id, ' +
        'weapon.canon, ' +
        'weapon.name, ' +
        'weapon.description, ' +
        'weapon_type.icon, ' +
        'weapon.is_legal AS isLegal, ' +
        'weapon.price, ' +
        'weapon.is_heavy AS isHeavy, ' +
        'weapon_type.can_equip AS canEquip, ' +
        'weapon.hit, ' +
        'weapon.hands, ' +
        'weapon.distance, ' +
        'weapon.created, ' +
        'weapon.updated, ' +
        'weapon.damage_dice AS damage__dice, ' +
        'weapon.damage_bonus AS damage__bonus, ' +
        'weapon.critical_dice AS critical__dice, ' +
        'weapon.critical_bonus AS critical__bonus, ' +
        'weapon_type.id AS type__id, ' +
        'weapon_type.name AS type__name, ' +
        'expertise.id AS expertise__id, ' +
        'expertise.name AS expertise__name, ' +
        'augmentation.id AS augmentation__id, ' +
        'augmentation.name AS augmentation__name, ' +
        'corporation.id AS corporation__id, ' +
        'corporation.name AS corporation__name, ' +
        'form.id AS form__id, ' +
        'form.name AS form__name, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'species.id AS species__id, ' +
        'species.name AS species__name, ' +
        'attribute.id AS damage__id, ' +
        'attribute.name AS damage__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'weapon_is_copy.copy_id AS copy__id ' +
        'FROM weapon ' +
        'LEFT JOIN weapon_is_augmentation ON weapon_is_augmentation.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_is_corporation ON weapon_is_corporation.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_is_form ON weapon_is_form.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_is_manifestation ON weapon_is_manifestation.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_is_species ON weapon_is_species.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_is_copy ON weapon_is_copy.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_type ON weapon_type.id = weapon.weapon_type_id ' +
        'LEFT JOIN augmentation ON augmentation.id = weapon_is_augmentation.augmentation_id ' +
        'LEFT JOIN corporation ON corporation.id = weapon_is_corporation.corporation_id ' +
        'LEFT JOIN form ON form.id = weapon_is_form.form_id ' +
        'LEFT JOIN manifestation ON manifestation.id = weapon_is_manifestation.manifestation_id ' +
        'LEFT JOIN species ON species.id = weapon_is_species.species_id ' +
        'LEFT JOIN attribute ON attribute.id = weapon_type.attribute_id ' +
        'LEFT JOIN expertise ON expertise.id = weapon_type.expertise_id ' +
        'LEFT JOIN account ON account.id = weapon.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);
    genericRouteHelper.routerRootPost(router, table);
    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/augmentation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN weapon_is_augmentation ON weapon_is_augmentation.weapon_id = weapon.id ' +
                'WHERE ' +
                'weapon.deleted = 0 AND ' +
                'weapon_is_augmentation.augmentation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/form/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN weapon_is_form ON weapon_is_form.weapon_id = weapon.id ' +
                'WHERE ' +
                'weapon.deleted = 0 AND ' +
                'weapon_is_form.form_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN weapon_is_manifestation ON weapon_is_manifestation.weapon_id = weapon.id ' +
                'WHERE ' +
                'weapon.deleted = 0 AND ' +
                'weapon_is_manifestation.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/species/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'LEFT JOIN weapon_is_species ON weapon_is_species.weapon_id = weapon.id ' +
                'WHERE ' +
                'weapon.deleted = 0 AND ' +
                'weapon_is_species.species_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/type/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' ' +
                'WHERE ' +
                'weapon.deleted = 0 AND ' +
                'weapon.weapon_type_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
