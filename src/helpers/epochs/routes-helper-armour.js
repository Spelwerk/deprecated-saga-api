'use strict';

const genericResponseHelper = require('../common/response-helper-generic');
const relationRouteHelper = require('../common/route-helper-relation');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const armoursRoute = (router) => {
    const table = 'epoch';
    const relation = 'armour';
    const query = 'SELECT ' +
        'armour.id, ' +
        'armour.name, ' +
        'armour.description, ' +
        'armour.icon, ' +
        'armour.price, ' +
        'body_part.id AS bodyPart__id, ' +
        'body_part.name AS bodyPart__name ' +
        'FROM epoch_has_armour ' +
        'LEFT JOIN armour ON armour.id = epoch_has_armour.armour_id ' +
        'LEFT JOIN body_part ON body_part.id = armour.body_part_id';

    relationRouteHelper.relationRootGet(router, table, relation, query);
    relationRouteHelper.relationRootPost(router, table, relation);

    router.route('/:id/armours/body-part/:part')
        .get(async (req, res, next) => {
            const call = query + ' WHERE ' +
                'armour.deleted = 0 AND ' +
                'epoch_has_armour.epoch_id = ? AND ' +
                'armour.body_part_id = ?';

            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.part])
        });

    relationRouteHelper.relationIdGet(router, table, relation, query);
    relationRouteHelper.relationIdPut(router, table, relation);
    relationRouteHelper.relationIdDelete(router, table, relation);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = armoursRoute;
