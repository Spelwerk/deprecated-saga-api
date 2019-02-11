'use strict';

const logger = require('../../logger/winston');
const saveTableSQLHelper = require('./sql-helper-save-table');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const addSave = async (req, res, next, table, tableId) => {
    logger.debug('accounts/response-helper-save-table.addSave', req.log);

    try {
        await saveTableSQLHelper.addSave(req.account.id, table, tableId);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const deleteSave = async (req, res, next, table, tableId) => {
    logger.debug('accounts/response-helper-save-table.deleteSave', req.log);

    try {
        await saveTableSQLHelper.deleteSave(req.account.id, table, tableId);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const setFavorite = async (req, res, next, table, tableId, boolean) => {
    logger.debug('accounts/response-helper-save-table.setFavorite', req.log);

    try {
        await saveTableSQLHelper.addSave(req.account.id, table, tableId, boolean);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const countFavorites = async (req, res, next, table, tableId) => {
    logger.debug('accounts/response-helper-save-table.getFavorites', req.log);

    try {
        const results = await saveTableSQLHelper.countFavorites(table, tableId);
        res.status(200).send({ results });
    } catch (err) {
        return next(err);
    }
};

const countSaves = async (req, res, next, table, tableId) => {
    logger.debug('accounts/response-helper-save-table.getSaves', req.log);

    try {
        const results = await saveTableSQLHelper.countSaves(table, tableId);
        res.status(200).send({ results });
    } catch (err) {
        return next(err);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    addSave,
    deleteSave,
    setFavorite,
    countFavorites,
    countSaves,
};
