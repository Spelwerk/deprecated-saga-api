'use strict';

const genericResponseHelper = require('./response-helper-generic');
const commentResponseHelper = require('./response-helper-comment');
const imageResponseHelper = require('./response-helper-image');
const labelResponseHelper = require('./response-helper-label');
const { getSchema } = require('../../initializers/database');
const { saveTable } = require('../accounts');

// ////////////////////////////////////////////////////////////////////////////////// //
// AUTOMATIC
// ////////////////////////////////////////////////////////////////////////////////// //

const schemaGeneratedRoutes = (router, table) => {
    const schema = getSchema(table);

    if (schema.fields.deleted) {
        routerIdDelete(router, table);
    }

    if (schema.fields.canon) {
        routerIdCanon(router, table);
    }

    if (schema.supports.copies) {
        routerIdClone(router, table);
    }

    if (schema.supports.comments) {
        routerIdComments(router, table);
    }

    if (schema.supports.images) {
        routerIdImages(router, table);
    }

    if (schema.supports.labels) {
        routerIdLabels(router, table);
    }

    if (schema.fields.deleted) {
        routerIdRevive(router, table);
    }

    if (schema.security.account) {
        routerIdSaves(router, table);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// BASE
// ////////////////////////////////////////////////////////////////////////////////// //

const routerRoot = (router, table, query) => {
    router.route('/')
        .get(async (req, res, next) => {
            const call = `${query} WHERE ${table}.deleted = 0 AND ${table}.canon = 1`;
            await genericResponseHelper.GET(req, res, next, call);
        });
};

const routerRootDeleted = (router, table, query) => {
    router.route('/deleted')
        .get(async (req, res, next) => {
            const call = `${query} WHERE ${table}.deleted = 1`;
            await genericResponseHelper.GET(req, res, next, call);
        });
};

const routerRootHidden = (router, table, query) => {
    router.route('/hidden')
        .get(async (req, res, next) => {
            const call = `${query} WHERE ${table}.deleted = 0 AND ${table}.canon = 0`;
            await genericResponseHelper.GET(req, res, next, call);
        });
};

const routerRootPost = (router, table) => {
    router.route('/')
        .post(async (req, res, next) => {
            await genericResponseHelper.POST(req, res, next, table);
        });
};

const routerRootSchema = (router, table) => {
    router.route('/schema')
        .get(async (req, res, next) => {
            try {
                const schema = getSchema(table);
                res.status(200).send(schema);
            } catch (e) {
                return next(e);
            }
        });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// ID
// ////////////////////////////////////////////////////////////////////////////////// //

const routerId = (router, table, query) => {
    router.route('/:id')
        .get(async (req, res, next) => {
            const call = `${query} WHERE ${table}.deleted = 0 AND ${table}.id = ?`;
            await genericResponseHelper.GET(req, res, next, call, [req.params.id], true);
        });
};

const routerIdDelete = (router, table) => {
    router.route('/:id')
        .delete(async (req, res, next) => {
            await genericResponseHelper.DELETE(req, res, next, table, req.params.id);
        });
};

const routerIdUpdate = (router, table) => {
    router.route('/:id')
        .put(async (req, res, next) => {
            await genericResponseHelper.PUT(req, res, next, table, req.params.id);
        });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXTRA ROUTES
// ////////////////////////////////////////////////////////////////////////////////// //

const routerIdCanon = (router, table) => {
    router.route('/:id/canon/:boolean')
        .put(async (req, res, next) => {
            await genericResponseHelper.CANON(req, res, next, table, req.params.id, req.params.boolean);
        });
};

const routerIdClone = (router, table) => {
    router.route('/:id/clone')
        .post(async (req, res, next) => {
            await genericResponseHelper.CLONE(req, res, next, table, req.params.id);
        });
};

const routerIdComments = (router, table) => {
    const table_has_comment = `${table}_has_comment`;
    const table_id = `${table}_id`;
    const query = 'SELECT ' +
        'comment.id, ' +
        'comment.account_id, ' +
        'comment.comment, ' +
        'comment.created, ' +
        'comment.updated, ' +
        'comment.deleted, ' +
        'account.display_name ' +
        'FROM ' + table_has_comment + ' ' +
        'LEFT JOIN comment ON comment.id = ' + table_has_comment + '.comment_id ' +
        'LEFT JOIN account ON account.id = comment.account_id ' +
        'WHERE ' +
        'comment.deleted = 0 AND ' +
        table_has_comment + '.' + table_id + ' = ?';

    router.route('/:id/comments')
        .get(async (req, res, next) => {
            await genericResponseHelper.GET(req, res, next, query, [req.params.id]);
        })
        .post(async (req, res, next) => {
            await commentResponseHelper.POST(req, res, next, table, req.params.id);
        });
};

const routerIdImages = (router, table) => {
    const table_has_image = `${table}_has_image`;
    const table_id = `${table}_id`;
    const query = 'SELECT ' +
        'image.id, ' +
        'image.path ' +
        'FROM ' + table_has_image + ' ' +
        'LEFT JOIN image ON image.id = ' + table_has_image + '.image_id ' +
        'WHERE ' +
        'image.deleted = 0 AND ' +
        table_has_image + '.' + table_id + ' = ?';

    router.route('/:id/images')
        .get(async (req, res, next) => {
            await genericResponseHelper.GET(req, res, next, query, [req.params.id]);
        })
        .post(async (req, res, next) => {
            await imageResponseHelper.POST(req, req, next, table, req.params.id);
        });

    router.route('/:id/images/:image')
        .get(async (req, res, next) => {
            const call = sql + ' AND ' + table_has_image + '.image_id = ?';
            await genericResponseHelper.GET(req, res, next, call, [req.params.id, req.params.image], true);
        })
        .delete(async (req, res, next) => {
            await imageResponseHelper.DELETE(req, res, next, table, req.params.id, req.params.image);
        });

};

const routerIdLabels = (router, table) => {
    const table_has_label = `${table}_has_label`;
    const table_id = `${table}_id`;
    const query = 'SELECT ' +
        'label.id, ' +
        'label.name ' +
        'FROM ' + table_has_label + ' ' +
        'LEFT JOIN label ON label.id = ' + table_has_label + '.label_id ' +
        'WHERE ' + table_has_label + '.' + table_id + ' = ?';

    router.route('/:id/labels')
        .get(async (req, res, next) => {
            await genericResponseHelper.GET(req, res, next, query, [req.params.id]);
        })
        .post(async (req, res, next) => {
            await labelResponseHelper.POST(req, res, next, table, req.params.id);
        });

    router.route('/:id/labels/:label')
        .delete(async (req, res, next) => {
            await labelResponseHelper.DELETE(req, res, next, table, req.params.id, req.params.label);
        });
};

const routerIdRevive = (router, table) => {
    router.route('/:id/revive')
        .put(async (req, res, next) => {
            await genericResponseHelper.REVIVE(req, res, next, table, req.params.id);
        });
};

const routerIdSaves = (router, table) => {
    router.route('/:id/save')
        .post(async (req, res, next) => {
            try {
                await saveTable.addSave(req, res, next, table, req.params.id);
                res.status(204).send();
            } catch (e) {
                return next(e);
            }
        })
        .delete(async (req, res, next) => {
            try {
                await saveTable.deleteSave(req, res, next, table, req.params.id);
                res.status(204).send();
            } catch (e) {
                return next(e);
            }
        });

    router.route('/:id/favorite/:favorite')
        .put(async (req, res, next) => {
            try {
                await saveTable.setFavorite(req, res, next, table, req.params.id, req.params.favorite);
                res.status(204).send();
            } catch (e) {
                return next(e);
            }
        });

    router.get('/:id/count/favorites')
        .get(async (req, res, next) => {
            try {
                const result = saveTable.countFavorites(req, res, next, table, req.params.id);
                res.status(200).send(result);
            } catch (e) {
                return next(e);
            }
        });

    router.get('/:id/count/saves')
        .get(async (req, res, next) => {
            try {
                const result = saveTable.countSaves(req, res, next, table, req.params.id);
                res.status(200).send(result);
            } catch (e) {
                return next(e);
            }
        });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    schemaGeneratedRoutes,

    routerRoot,
    routerRootDeleted,
    routerRootHidden,
    routerRootPost,
    routerRootSchema,

    routerId,
    routerIdDelete, // schemaGeneratedRoutes
    routerIdUpdate,

    routerIdCanon, // schemaGeneratedRoutes
    routerIdClone, // schemaGeneratedRoutes
    routerIdComments, // schemaGeneratedRoutes
    routerIdImages, // schemaGeneratedRoutes
    routerIdLabels, // schemaGeneratedRoutes
    routerIdRevive, // schemaGeneratedRoutes
    routerIdSaves, // schemaGeneratedRoutes
};
