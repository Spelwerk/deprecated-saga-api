'use strict';

const genericResponseHelper = require('./response-helper-generic');
const relationResponseHelper = require('./response-helper-relation');
const { getSchema } = require('../../initializers/database');
const { Plural } = require('../../constants');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const getGenericRelationQuery = (table, relation) => {
    const table_has_relation = `${table}_has_${relation}`;
    const relation_id = `${relation}_id`;

    const schema = getSchema(table_has_relation);
    const nonIdFields = schema.fields.nonId;

    let query = `SELECT ${relation_id} AS id, name`;

    for (let i in nonIdFields) {
        const field = nonIdFields[i];
        query += `, ${field}`;
    }

    return `${query} FROM ${table_has_relation} ` +
        `LEFT JOIN ${relation} ON ${relation}.id = ${table_has_relation}.${relation_id}`;
};

// ////////////////////////////////////////////////////////////////////////////////// //
// BASE ROUTES
// ////////////////////////////////////////////////////////////////////////////////// //

const relationRootGet = (router, table, relation, query) => {
    const route = Plural[relation];
    const table_has_relation = `${table}_has_${relation}`;
    const table_id = `${table}_id`;

    router.route(`/:id/${route}`)
        .get(async (req, res, next) => {
            const call = `${query} WHERE ${table_has_relation}.${table_id} = ?`;
            await genericResponseHelper.GET(req, res, next, call, [req.params.id]);
        });
};

const relationRootPost = (router, table, relation) => {
    const route = Plural[relation];

    router.route(`/:id/${route}`)
        .post(async (req, res, next) => {
            await relationResponseHelper.POST(req, res, next, table, relation, req.params.id);
        });
};

const relationIdGet = (router, table, relation, query) => {
    const route = Plural[relation];
    const table_has_relation = `${table}_has_${relation}`;
    const table_id = `${table}_id`;
    const relation_id = `${relation}_id`;

    router.route(`/:id/${route}/:item`)
        .get(async (req, res, next) => {
            const call = `${query} WHERE ${table_has_relation}.${table_id} = ? AND ${table_has_relation}.${relation_id} = ?`;
            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.item], true);
        });
};

const relationIdPut = (router, table, relation) => {
    const route = Plural[relation];

    router.route(`/:id/${route}/:item`)
        .put(async (req, res, next) => {
            await relationResponseHelper.PUT(req, res, next, table, relation, req.params.id, req.params.item);
        });
};

const relationIdDelete = (router, table, relation) => {
    const route = Plural[relation];

    router.route(`/:id/${route}/:item`)
        .delete(async (req, res, next) => {
            await relationResponseHelper.DELETE(req, res, next, table, relation, req.params.id, req.params.item);
        });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// COMBINATION ROUTES
// ////////////////////////////////////////////////////////////////////////////////// //

const relationRoute = (router, table, relation, query) => {
    query = query || getGenericRelationQuery(table, relation);

    relationRootGet(router, table, relation, query);
    relationRootPost(router, table, relation);

    relationIdGet(router, table, relation, query);
    relationIdPut(router, table, relation);
    relationIdDelete(router, table, relation);
};

const schemaGeneratedRelations = (router, table) => {
    const schema = getSchema(table);
    const relations = schema.tables.hasMany;

    for (let i in relations) {
        const relation = relations[i];
        relationRoute(router, table, relation);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    getGenericRelationQuery,

    relationRootGet,
    relationRootPost,

    relationIdGet,
    relationIdPut,
    relationIdDelete,

    relationRoute,
    schemaGeneratedRelations,
};
