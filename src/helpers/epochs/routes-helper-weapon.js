'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRouteHelper = require('../common/route-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const weaponsRoute = (router) => {
    const table = 'epoch';
    const relation = 'weapon';
    const query = 'SELECT ' +
        'weapon.id, ' +
        'weapon.canon, ' +
        'weapon.name, ' +
        'weapon.description, ' +
        'weapon_type.icon, ' +
        'weapon.is_legal AS isLegal, ' +
        'weapon.price, ' +
        'weapon_type.can_equip AS canEquip, ' +
        'weapon.created, ' +
        'weapon.updated, ' +
        'weapon_type.id AS type__id, ' +
        'weapon_type.name AS type__name, ' +
        'attribute.id AS damage__id, ' +
        'attribute.name AS damage__name, ' +
        'weapon.damage_dice AS damage__dice, ' +
        'weapon.damage_bonus AS damage__bonus, ' +
        'weapon.critical_dice AS critical__dice, ' +
        'weapon.critical_bonus AS critical__bonus, ' +
        'weapon.hit, ' +
        'weapon.hands, ' +
        'weapon.distance ' +
        'FROM epoch_has_weapon ' +
        'LEFT JOIN weapon ON weapon.id = epoch_has_weapon.weapon_id ' +
        'LEFT JOIN weapon_is_augmentation ON weapon_is_augmentation.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_is_form ON weapon_is_form.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_is_manifestation ON weapon_is_manifestation.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_is_species ON weapon_is_species.weapon_id = weapon.id ' +
        'LEFT JOIN weapon_type ON weapon_type.id = weapon.weapon_type_id ' +
        'LEFT JOIN attribute ON attribute.id = weapon_type.attribute_id';

    relationRouteHelper.relationRootGet(router, table, relation, query);
    relationRouteHelper.relationRootPost(router, table, relation);

    router.route('/:id/weapons/type/:type')
        .get(async (req, res, next) => {
            let call = query + ' WHERE ' +
                'weapon.deleted = 0 AND ' +
                'epoch_has_weapon.epoch_id = ? AND ' +
                'weapon.weapon_type_id = ? AND ' +
                'weapon_is_augmentation.augmentation_id IS NULL AND ' +
                'weapon_is_form.form_id IS NULL AND ' +
                'weapon_is_manifestation.manifestation_id IS NULL AND ' +
                'weapon_is_species.species_id IS NULL';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.type]);
        });

    relationRouteHelper.relationIdGet(router, table, relation, query);
    relationRouteHelper.relationIdPut(router, table, relation);
    relationRouteHelper.relationIdDelete(router, table, relation);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = weaponsRoute;
