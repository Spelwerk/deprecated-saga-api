'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const spellResponseHelper = require('../../helpers/content/response-helper-spell');

module.exports = (router) => {
    const table = 'spell';
    const queryRoot = 'SELECT ' +
        'spell.id, ' +
        'spell.canon, ' +
        'spell.name, ' +
        'spell_type.icon, ' +
        'spell.created, ' +
        'spell.updated ' +
        'FROM spell ' +
        'LEFT JOIN spell_type ON spell_type.id = spell.spell_type_id';
    const queryId = 'SELECT ' +
        'spell.id, ' +
        'spell.canon, ' +
        'spell.name, ' +
        'spell.description, ' +
        'spell.effects, ' +
        'spell_type.icon, ' +
        'spell.cost, ' +
        'spell.distance, ' +
        'spell.created, ' +
        'spell.updated, ' +
        'spell.effect_dice AS effect__dice, ' +
        'spell.effect_bonus AS effect__bonus, ' +
        'spell.damage_dice AS damage__dice, ' +
        'spell.damage_bonus AS damage__bonus, ' +
        'spell.critical_dice AS critical__dice, ' +
        'spell.critical_bonus AS critical__bonus, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'expertise.id AS expertise__id, ' +
        'expertise.name AS expertise__name, ' +
        'spell_type.id AS type__id, ' +
        'spell_type.name AS type__name, ' +
        'attribute.id AS damage__id, ' +
        'attribute.name AS damage__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'spell_is_copy.copy_id AS copy__id ' +
        'FROM spell ' +
        'LEFT JOIN spell_is_copy ON spell_is_copy.spell_id = spell.id ' +
        'LEFT JOIN spell_type ON spell_type.id = spell.spell_type_id ' +
        'LEFT JOIN manifestation ON manifestation.id = spell_type.manifestation_id ' +
        'LEFT JOIN expertise ON expertise.id = spell_type.expertise_id ' +
        'LEFT JOIN attribute ON attribute.id = spell.attribute_id ' +
        'LEFT JOIN account ON account.id = spell.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await spellResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/type/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE spell.deleted = 0 AND ' +
                'spell.spell_type_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE spell.deleted = 0 AND ' +
                'spell_type.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
};
