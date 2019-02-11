'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRoutesHelper = require('../common/route-helper-relation');
const uniqueIdResponseHelper = require('../common/response-helper-relation-unique-id');
const { Plural } = require('../../constants');

const attributeResponseHelper = require('./response-helper-attribute');
const augmentationResponseHelper = require('./response-helper-augmentation');
const backgroundResponseHelper = require('./response-helper-background');
const bionicResponseHelper = require('./response-helper-bionic');
const manifestationResponseHelper = require('./response-helper-manifestation');
const milestoneResponseHelper = require('./response-helper-milestone');
const primalResponseHelper = require('./response-helper-primal');
const skillResponseHelper = require('./response-helper-skill');
const weaponResponseHelper = require('./response-helper-weapon');
const weaponModResponseHelper = require('./response-helper-weapon-mod');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const armourRoutes = (router) => {
    const table = 'creature';
    const relation = 'armour';
    const query = 'SELECT ' +
        'armour.id, ' +
        'armour.name, ' +
        'armour.description, ' +
        'creature_has_armour.custom, ' +
        'armour.icon, ' +
        'armour.price, ' +
        'creature_has_armour.equipped, ' +
        'body_part.id AS bodyPart__id, ' +
        'body_part.name AS bodyPart__name ' +
        'FROM creature_has_armour ' +
        'LEFT JOIN armour ON armour.id = creature_has_armour.armour_id ' +
        'LEFT JOIN body_part on body_part.id = armour.body_part_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const assetRoutes = (router) => {
    const table = 'creature';
    const relation = 'asset';
    const query = 'SELECT ' +
        'asset.id, ' +
        'asset.name, ' +
        'asset.description, ' +
        'creature_has_asset.custom, ' +
        'asset.equipable, ' +
        'asset.legal, ' +
        'asset.price, ' +
        'creature_has_asset.equipped, ' +
        'creature_has_asset.value, ' +
        'asset_type.id AS type__id, ' +
        'asset_type.name AS type__name ' +
        'FROM creature_has_asset ' +
        'LEFT JOIN asset ON asset.id = creature_has_asset.asset_id ' +
        'LEFT JOIN asset_type ON asset_type.id = asset.asset_type_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const attributeRoutes = (router) => {
    const table = 'creature';
    const relation = 'attribute';

    router.route(`/:id/attributes`)
        .get(async (req, res, next) => {
            await attributeResponseHelper.GET(req, res, next, req.params.id);
        });

    relationRoutesHelper.relationRootPost(router, table, relation);
    relationRoutesHelper.relationIdPut(router, table, relation);
};

const backgroundRoutes = (router) => {
    const table = 'creature';
    const relation = 'armour';
    const route = Plural[relation];
    const query = 'SELECT ' +
        'background.id, ' +
        'background.name, ' +
        'background.description, ' +
        'creature_has_background.custom, ' +
        'background.icon ' +
        'FROM creature_has_background ' +
        'LEFT JOIN background ON background.id = creature_has_background.background_id';

    relationRoutesHelper.relationRootGet(router, table, relation, query);

    router.route(`/:id/${route}`)
        .post(async (req, res, next) => {
            await backgroundResponseHelper.POST(req, res, next, req.params.id);
        });

    relationRoutesHelper.relationIdGet(router, table, relation, query);
    relationRoutesHelper.relationIdPut(router, table, relation);
    relationRoutesHelper.relationIdDelete(router, table, relation);
};

const bionicRoutes = (router) => {
    const table = 'creature';
    const relation = 'armour';
    const route = Plural[relation];
    const query = 'SELECT ' +
        'bionic.id, ' +
        'bionic.name, ' +
        'bionic.description, ' +
        'creature_has_bionic.custom, ' +
        'bionic.icon, ' +
        'bionic.legal, ' +
        'bionic.price, ' +
        'bionic.hacking_difficulty AS hacking__difficulty, ' +
        'body_part.id AS bodyPart__id, ' +
        'body_part.name AS bodyPart__name ' +
        'FROM creature_has_bionic ' +
        'LEFT JOIN bionic ON bionic.id = creature_has_bionic.bionic_id ' +
        'LEFT JOIN body_part ON body_part.id = bionic.body_part_id';

    relationRoutesHelper.relationRootGet(router, table, relation, query);
    relationRoutesHelper.relationRootPost(router, table, relation);
    relationRoutesHelper.relationIdGet(router, table, relation, query);
    relationRoutesHelper.relationIdPut(router, table, relation);

    router.route(`/:id/${route}/:bionic`)
        .delete(async (req, res, next) => {
            await bionicResponseHelper.DELETE(req, res, next, req.params.id, req.params.bionic);
        });

    // Augmentations

    router.route(`/:id/${route}/:bionic/augmentations`)
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'augmentation.id, ' +
                'augmentation.name, ' +
                'augmentation.description, ' +
                'augmentation.legal, ' +
                'augmentation.price, ' +
                'augmentation.hacking_difficulty AS hacking__difficulty' +
                'FROM creature_has_augmentation ' +
                'LEFT JOIN augmentation ON augmentation.id = creature_has_augmentation.augmentation_id ' +
                'WHERE ' +
                'creature_has_augmentation.creature_id = ? AND ' +
                'creature_has_augmentation.bionic_id = ?';

            await genericResponseHelper.GET(req, res, next, query, [req.params.id, req.params.bionic]);
        })
        .post(async (req, res, next) => {
            await augmentationResponseHelper.POST(req, res, next, req.params.id, req.params.bionic);
        });

    router.route(`/:id/${route}/:bionic/augmentations/:augmentation`)
        .delete(async (req, res, next) => {
            await augmentationResponseHelper.DELETE(req, res, next, req.params.id, req.params.bionic, req.params.augmentation);
        });
};

const currencyRoutes = (router) => {
    const table = 'creature';
    const relation = 'currency';
    const query = 'SELECT ' +
        'currency.id, ' +
        'currency.name, ' +
        'currency.description, ' +
        'currency.short, ' +
        'currency.exchange, ' +
        'creature_has_currency.value ' +
        'FROM creature_has_currency ' +
        'LEFT JOIN currency ON currency.id = creature_has_currency.currency_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const expertiseRoutes = (router) => {
    const table = 'creature';
    const relation = 'expertise';
    const query = 'SELECT ' +
        'expertise.id, ' +
        'expertise.name, ' +
        'expertise.description, ' +
        'creature_has_expertise.custom, ' +
        'skill.icon, ' +
        'skill.id AS skill__id, ' +
        'skill.name AS skill__name, ' +
        'expertise.skill_dice AS skill__dice, ' +
        'expertise.skill_bonus AS skill__bonus ' +
        'FROM creature_has_expertise ' +
        'LEFT JOIN expertise ON expertise.id = creature_has_expertise.expertise_id ' +
        'LEFT JOIN skill ON skill.id = expertise.skill_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const formRoutes = (router) => {
    const table = 'creature';
    const relation = 'form';
    const query = 'SELECT ' +
        'form.id, ' +
        'form.name, ' +
        'form.description, ' +
        'form.icon, ' +
        'form.appearance, ' +
        'form.manifestation_id AS manifestation__id, ' +
        'form.expertise_id AS expertise__id, ' +
        'form.species_id AS species__id ' +
        'FROM creature_has_form ' +
        'LEFT JOIN form ON form.id = creature_has_form.form_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const giftRoutes = (router) => {
    const table = 'creature';
    const relation = 'gift';
    const query = 'SELECT ' +
        'gift.id, ' +
        'gift.name, ' +
        'gift.description, ' +
        'creature_has_gift.custom ' +
        'FROM creature_has_gift ' +
        'LEFT JOIN gift ON gift.id = creature_has_gift.gift_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const imperfectionRoutes = (router) => {
    const table = 'creature';
    const relation = 'imperfection';
    const query = 'SELECT ' +
        'imperfection.id, ' +
        'imperfection.name, ' +
        'imperfection.description, ' +
        'creature_has_imperfection.custom ' +
        'FROM creature_has_imperfection ' +
        'LEFT JOIN imperfection ON imperfection.id = creature_has_imperfection.imperfection_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const languageRoutes = (router) => {
    const table = 'creature';
    const relation = 'language';
    const query = 'SELECT ' +
        'language.id, ' +
        'language.name, ' +
        'language.description, ' +
        'creature_has_language.fluent ' +
        'FROM creature_has_language ' +
        'LEFT JOIN language ON language.id = creature_has_language.language_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const loyaltyRoutes = (router) => {
    const table = 'creature';
    const relation = 'loyalty';
    const route = Plural[relation];
    const query = 'SELECT ' +
        'creature_has_loyalty.id, ' +
        'creature_has_loyalty.name, ' +
        'creature_has_loyalty.occupation, ' +
        'loyalty.id AS loyalty__id, ' +
        'loyalty.name AS loyalty__name, ' +
        'wealth.id AS wealth__id, ' +
        'wealth.name AS wealth__name ' +
        'FROM creature_has_loyalty ' +
        'LEFT JOIN loyalty ON loyalty.id = creature_has_loyalty.loyalty_id ' +
        'LEFT JOIN wealth ON wealth.id = creature_has_loyalty.wealth_id';

    relationRoutesHelper.relationRootGet(router, table, relation, query);
    relationRoutesHelper.relationRootPost(router, table, relation);

    router.route(`/:id/${route}/:unique`)
        .get(async (req, res, next) => {
            const call = query + ' WHERE creature_has_loyalty.creature_id = ? AND id = ?';
            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.unique], true);
        })
        .put(async (req, res, next) => {
            await uniqueIdResponseHelper.UPDATE(req, res, next, table, relation, req.params.id, req.params.unique);
        })
        .delete(async (req, res, next) => {
            await uniqueIdResponseHelper.DELETE(req, res, next, table, relation, req.params.id, req.params.unique);
        });
};

const manifestationRoutes = (router) => {
    const table = 'creature';
    const relation = 'manifestation';
    const route = Plural[relation];
    const query = 'SELECT ' +
        'manifestation.id, ' +
        'manifestation.name, ' +
        'manifestation.description, ' +
        'manifestation.icon, ' +
        'focus.id AS focus__id,' +
        'focus.name AS focus__name,' +
        'focus.description AS focus__description,' +
        'focus.icon AS focus__icon ' +
        'FROM creature_has_manifestation ' +
        'LEFT JOIN manifestation ON manifestation.id = creature_has_manifestation.manifestation_id ' +
        'LEFT JOIN focus ON focus.id = creature_has_manifestation.focus_id';

    relationRoutesHelper.relationRootGet(router, table, relation, query);

    router.route(`/:id/${route}`)
        .post(async (req, res, next) => {
            await manifestationResponseHelper.POST(req, res, next, req.params.id);
        });

    relationRoutesHelper.relationIdGet(router, table, relation, query);
    relationRoutesHelper.relationIdPut(router, table, relation);
    relationRoutesHelper.relationIdDelete(router, table, relation);
};

const milestoneRoutes = (router) => {
    const table = 'creature';
    const relation = 'milestone';
    const route = Plural[relation];
    const query = 'SELECT ' +
        'milestone.id, ' +
        'milestone.name, ' +
        'milestone.description, ' +
        'creature_has_milestone.custom ' +
        'FROM creature_has_milestone ' +
        'LEFT JOIN milestone ON milestone.id = creature_has_milestone.milestone_id';

    relationRoutesHelper.relationRootGet(router, table, relation, query);

    router.route(`/:id/${route}`)
        .post(async (req, res, next) => {
            await milestoneResponseHelper.POST(req, res, next, req.params.id);
        });

    relationRoutesHelper.relationIdGet(router, table, relation, query);
    relationRoutesHelper.relationIdPut(router, table, relation);
    relationRoutesHelper.relationIdDelete(router, table, relation);
};

const primalRoutes = (router) => {
    const table = 'creature';
    const relation = 'primal';

    router.route(`/:id/primals`)
        .get(async (req, res, next) => {
            await primalResponseHelper.GET(req, res, next, req.params.id);
        });

    relationRoutesHelper.relationRootPost(router, table, relation);
    relationRoutesHelper.relationIdPut(router, table, relation);
};

const relationRoutes = (router) => {
    const table = 'creature';
    const relation = 'relation';
    const query = 'SELECT ' +
        'creature.id, ' +
        'creature.name_first AS name, ' +
        'creature.occupation, ' +
        'loyalty.id AS loyalty__id, ' +
        'loyalty.name AS loyalty__name, ' +
        'wealth.id AS wealth__id, ' +
        'wealth.name AS wealth__name ' +
        'FROM creature_has_relation ' +
        'LEFT JOIN creature ON creature.id = creature_has_relation.relation_id ' +
        'LEFT JOIN milestone ON milestone.id = creature_has_relation.milestone_id ' +
        'LEFT JOIN loyalty ON loyalty.id = creature_has_relation.loyalty_id ' +
        'LEFT JOIN creature_is_wealth ON creature_is_wealth.creature_id = creature.id ' +
        'LEFT JOIN wealth ON wealth.id = creature_is_wealth.wealth_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const shieldRoutes = (router) => {
    const table = 'creature';
    const relation = 'shield';
    const query = 'SELECT ' +
        'shield.id, ' +
        'shield.name, ' +
        'shield.description, ' +
        'creature_has_shield.custom, ' +
        'shield.icon, ' +
        'shield.price, ' +
        'attribute.id AS damage__id, ' +
        'attribute.name AS damage__name, ' +
        'shield.damage_dice AS damage__dice, ' +
        'shield.damage_bonus AS damage__bonus, ' +
        'shield.critical_dice AS critical__dice, ' +
        'shield.critical_bonus AS critical__bonus, ' +
        'shield.expertise_id AS expertise__id, ' +
        'creature_has_shield.equipped ' +
        'FROM creature_has_shield ' +
        'LEFT JOIN shield ON shield.id = creature_has_shield.shield_id ' +
        'LEFT JOIN attribute ON attribute.id = shield.attribute_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const skillRoutes = (router) => {
    const table = 'creature';
    const relation = 'skill';

    router.route(`/:id/skills`)
        .get(async (req, res, next) => {
            await skillResponseHelper.GET(req, res, next, req.params.id);
        });

    relationRoutesHelper.relationRootPost(router, table, relation);
    relationRoutesHelper.relationIdPut(router, table, relation);
};

const spellRoutes = (router) => {
    const table = 'creature';
    const relation = 'spell';
    const query = 'SELECT ' +
        'spell.id, ' +
        'spell.name, ' +
        'spell.description, ' +
        'spell.effects, ' +
        'spell.icon, ' +
        'spell.cost, ' +
        'spell.distance, ' +
        'spell.effect_dice AS effect__dice, ' +
        'spell.effect_bonus AS effect__bonus, ' +
        'spell.damage_dice AS damage__dice, ' +
        'spell.damage_bonus AS damage__bonus, ' +
        'spell.critical_dice AS critical__dice, ' +
        'spell.critical_bonus AS critical__bonus, ' +
        'attribute.id AS damage_id AS damage__id, ' +
        'attribute.name AS damage_name AS damage__name ' +
        'FROM creature_has_spell ' +
        'LEFT JOIN spell ON spell.id = creature_has_spell.spell_id ' +
        'LEFT JOIN attribute ON attribute.id = spell.attribute_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const softwareRoutes = (router) => {
    const table = 'creature';
    const relation = 'software';
    const query = 'SELECT ' +
        'software.id, ' +
        'software.name, ' +
        'software.description, ' +
        'software.legal, ' +
        'software.price, ' +
        'software.hacking_difficulty AS hacking__difficulty, ' +
        'software.hacking_bonus AS hacking__bonus, ' +
        'software_type.id AS type__id, ' +
        'software_type.name AS type__name ' +
        'FROM creature_has_software ' +
        'LEFT JOIN software ON software.id = creature_has_software.software_id ' +
        'LEFT JOIN software_type ON software_type.id = software.software_type_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const tacticRoutes = (router) => {
    const table = 'creature';
    const relation = 'tactic';
    const query = 'SELECT ' +
        'tactic.id, ' +
        'tactic.name, ' +
        'tactic.description, ' +
        'tactic.effects, ' +
        'tactic.icon, ' +
        'tactic.cost, ' +
        'tactic.damage_dice AS damage__dice, ' +
        'tactic.damage_bonus AS damage__bonus, ' +
        'tactic.critical_dice AS critical__dice, ' +
        'tactic.critical_bonus AS critical__bonus, ' +
        'tactic.weapon_type_id AS type__id ' +
        'FROM creature_has_tactic ' +
        'LEFT JOIN tactic ON tactic.id = creature_has_tactic.tactic_id';

    relationRoutesHelper.relationRoute(router, table, relation, query);
};

const weaponRoutes = (router) => {
    const table = 'creature';
    const relation = 'weapon';
    const route = Plural[relation];
    const query = 'SELECT weapon_id AS id, equipped, custom FROM creature_has_weapon';

    relationRoutesHelper.relationRootGet(router, table, relation, query);
    relationRoutesHelper.relationRootPost(router, table, relation);
    relationRoutesHelper.relationIdGet(router, table, relation, query);
    relationRoutesHelper.relationIdPut(router, table, relation);

    router.route(`/:id/${route}/:weapon`)
        .delete(async (req, res, next) => {
            await weaponResponseHelper.DELETE(req, res, next, req.params.id, req.params.weapon);
        });

    router.route(`/:id/${route}/:weapon/mods`)
        .get(async (req, res, next) => {
            let call = 'SELECT ' +
                'weapon_mod.id, ' +
                'weapon_mod.name, ' +
                'weapon_mod.description, ' +
                'weapon_mod.icon, ' +
                'weapon_mod.short, ' +
                'weapon_mod.price, ' +
                'weapon_mod.hit, ' +
                'weapon_mod.hands, ' +
                'weapon_mod.distance, ' +
                'weapon_mod.damage_dice AS damage__dice, ' +
                'weapon_mod.damage_bonus AS damage__bonus, ' +
                'weapon_mod.critical_dice AS critical__dice, ' +
                'weapon_mod.critical_bonus AS critical__bonus ' +
                'FROM creature_has_weapon_mod ' +
                'LEFT JOIN weapon_mod ON weapon_mod.id = creature_has_weapon_mod.weapon_mod_id ' +
                'WHERE ' +
                'creature_has_weapon_mod.creature_id = ? AND ' +
                'creature_has_weapon_mod.weapon_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.weapon]);
        })
        .post(async (req, res, next) => {
            await weaponModResponseHelper.POST(req, res, next, req.params.id, req.params.weapon);
        });

    router.route(`/:id/${route}/:weapon/mods/:mod`)
        .delete(async (req, res, next) => {
            await weaponModResponseHelper.DELETE(req, res, next, req.params.id, req.params.weapon, req.params.mod);
        });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    armourRoutes,
    assetRoutes,
    attributeRoutes,
    backgroundRoutes,
    bionicRoutes,
    currencyRoutes,
    expertiseRoutes,
    formRoutes,
    giftRoutes,
    imperfectionRoutes,
    languageRoutes,
    loyaltyRoutes,
    manifestationRoutes,
    milestoneRoutes,
    primalRoutes,
    relationRoutes,
    shieldRoutes,
    skillRoutes,
    spellRoutes,
    softwareRoutes,
    tacticRoutes,
    weaponRoutes,
};
