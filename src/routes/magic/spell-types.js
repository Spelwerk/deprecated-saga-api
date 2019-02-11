'use strict';

const genericResponseHelper = require('../../helpers/common/response-helper-generic');
const genericRouteHelper = require('../../helpers/common/route-helper-generic');
const spellTypeResponseHelper = require('../../helpers/content/response-helper-spell-type');
const relationRouteHelper = require('../../helpers/common/route-helper-relation');

module.exports = (router) => {
    const table = 'spell_type';
    const queryRoot = `SELECT id, canon, name, icon, created, updated FROM ${table}`;
    const queryId = 'SELECT ' +
        'spell_type.id, ' +
        'spell_type.canon, ' +
        'spell_type.name, ' +
        'spell_type.description, ' +
        'spell_type.icon, ' +
        'spell_type.created, ' +
        'spell_type.updated, ' +
        'manifestation.id AS manifestation__id, ' +
        'manifestation.name AS manifestation__name, ' +
        'expertise.id AS expertise__id, ' +
        'expertise.name AS expertise__name, ' +
        'account.id AS owner__id, ' +
        'account.display_name AS owner__name, ' +
        'spell_type_is_copy.copy_id AS copy__id ' +
        'FROM spell_type ' +
        'LEFT JOIN spell_type_is_copy ON spell_type_is_copy.spell_type_id = spell_type.id ' +
        'LEFT JOIN manifestation ON manifestation.id = spell_type.manifestation_id ' +
        'LEFT JOIN expertise ON expertise.id = spell_type.expertise_id ' +
        'LEFT JOIN account ON account.id = spell_type.account_id';

    genericRouteHelper.routerRoot(router, table, queryRoot);

    router.route('/')
        .post(async (req, res, next) => {
            await spellTypeResponseHelper.POST(req, res, next);
        });

    genericRouteHelper.routerRootDeleted(router, table, queryRoot);
    genericRouteHelper.routerRootHidden(router, table, queryRoot);
    genericRouteHelper.routerRootSchema(router, table);

    router.route('/manifestation/:id')
        .get(async (req, res, next) => {
            const call = queryRoot + ' WHERE spell_type.deleted = 0 AND ' +
                'spell_type.manifestation_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });

    genericRouteHelper.routerId(router, table, queryId);
    genericRouteHelper.routerIdUpdate(router, table);

    genericRouteHelper.schemaGeneratedRoutes(router, table);
    relationRouteHelper.schemaGeneratedRelations(router, table);
};
