'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('./sql-helper');
const genericRequestHelper = require('./request-helper-generic');
const { HeaderKey } = require('../../constants');

const AppError = require('../../errors/app-error');
const AccountNotAdministratorError = require('../../errors/account-not-administrator-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const GET = async (req, res, next, query, params, expectingSingleObject) => {
    logger.debug('common-response-helper-generic.GET', req.log);

    expectingSingleObject = expectingSingleObject || false;

    const sort = !!req.headers[HeaderKey.SORT]
        ? JSON.parse(req.headers[HeaderKey.SORT])
        : null;

    const options = {
        sort: sort,
        limit: req.headers[HeaderKey.PAGINATION_LIMIT] || null,
        offset: req.headers[HeaderKey.PAGINATION_OFFSET] || null,
    };

    if (options && options.sort) {
        query += ' ORDER BY ';

        for (let key in options.sort) {
            if (!options.sort.hasOwnProperty(key)) continue;

            query += `${key} ${options.sort[key]}, `;
        }

        query = query.slice(0, -2);
    }

    if (options && options.limit && options.limit !== null && options.limit !== '') {
        query += ' LIMIT ' + options.limit;
    }

    if (options && options.offset && options.offset !== null && options.offset !== '') {
        query += ' OFFSET ' + options.offset;
    }

    try {
        const rows = await SQLHelper.SQL(query, params);

        if (expectingSingleObject && (!rows || !rows.length)) {
            return next(new AppError(404, 'Not Found', 'The requested item could not be found in the database.'));
        }

        const data = expectingSingleObject
            ? { result: rows[0] }
            : { results: rows };

        res.status(200).send(data);
    } catch (e) {
        return next(e);
    }
};

const POST = async (req, res, next, tableName) => {
    logger.debug('common-response-helper-generic.POST', req.log);

    try {
        const id = await genericRequestHelper.INSERT(req, req.body, tableName);
        res.status(201).send({ id });
    } catch (e) {
        return next(e);
    }
};

const PUT = async (req, res, next, tableName, tableId) => {
    logger.debug('common-response-helper-generic.PUT', req.log);

    try {
        await genericRequestHelper.UPDATE(req, req.body, tableName, tableId);
        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const DELETE = async (req, res, next, tableName, tableId) => {
    logger.debug('common-response-helper-generic.DELETE', req.log);

    try {
        await genericRequestHelper.DELETE(req, tableName, tableId);
        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const REVIVE = async (req, res, next, tableName, tableId) => {
    logger.debug('common-response-helper-generic.REVIVE', req.log);

    if (!req.account.roles.ADMIN) {
        return next(new AccountNotAdministratorError);
    }

    tableId = parseInt(tableId);

    try {
        await SQLHelper.UPDATE(tableName, { deleted: false }, { id: tableId });
        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const CANON = async (req, res, next, tableName, tableId, boolean) => {
    logger.debug('common-response-helper-generic.CANON', req.log);

    if (!req.account.roles.ADMIN) {
        return next(new AccountNotAdministratorError);
    }

    tableId = parseInt(tableId);

    const canon = boolean || false;

    try {
        await SQLHelper.UPDATE(tableName, { canon }, { id: tableId });
        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const CLONE = async (req, res, next, tableName, tableId) => {
    logger.debug('common-response-helper-generic.CLONE', req.log);

    try {
        const id = await genericRequestHelper.CLONE(req, tableName, tableId);
        res.status(201).send({ id });
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    GET,
    POST,
    PUT,
    DELETE,
    REVIVE,
    CANON,
    CLONE,
};
