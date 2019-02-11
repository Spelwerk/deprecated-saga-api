'use strict';

const logger = require('../../logger/winston');
const securityQuestionSQLHelper = require('./sql-helper-security-question');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const GET = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-security-question.GET');

    try {
        const result = await securityQuestionSQLHelper.SELECT(accountId);
        res.status(200).send(result);
    } catch (err) {
        return next(err);
    }
};

const POST = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-security-question.POST', req.log);

    try {
        await securityQuestionSQLHelper.INSERT(accountId, req.params.id, req.body.securityQuestionId, req.body.answer);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const PUT = async (req, res, next, accountId, securityQuestionId) => {
    logger.debug('accounts/sql-helper-security-question.PUT', req.log);

    try {
        await securityQuestionSQLHelper.UPDATE(accountId, req.params.id, securityQuestionId, req.body.answer);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const DELETE = async (req, res, next, accountId, securityQuestionId) => {
    logger.debug('accounts/sql-helper-security-question.DELETE', req.log);

    try {
        await securityQuestionSQLHelper.DELETE(accountId, req.account.id, securityQuestionId);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const getValidation = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-security-question.getValidation', req.log);

    try {
        const result = await securityQuestionSQLHelper.getValidation(accountId);
        res.status(200).send(result);
    } catch (err) {
        return next(err);
    }
};

const tryValidation = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-security-question.getValidation', req.log);

    try {
        await securityQuestionSQLHelper.tryValidation(accountId, req.body.securityQuestionId, req.body.answer);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    GET,
    POST,
    PUT,
    DELETE,
    getValidation,
    tryValidation,
};
