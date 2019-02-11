'use strict';

const logger = require('../../logger/winston');
const roleSQLHelper = require('./sql-helper-role');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const GET = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-roles.getRoles');

    try {
        const roles = await roleSQLHelper.SELECT(accountId);
        res.status(200).send({ roles });
    } catch (err) {
        return next(err);
    }
};

const POST = async (req, res, next, accountId) => {
    logger.debug('accounts/sql-helper-roles.setRole', req.log);

    try {
        await roleSQLHelper.INSERT(accountId, req.account.id, req.body.role_id);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

const DELETE = async (req, res, next, accountId, roleId) => {
    logger.debug('accounts/sql-helper-roles.removeRole', req.log);

    try {
        await roleSQLHelper.DELETE(accountId, req.account.id, roleId);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    GET,
    POST,
    DELETE,
};
