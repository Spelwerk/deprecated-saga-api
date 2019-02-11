'use strict';

const logger = require('../../logger/winston');
const SQLHelper = require('./sql-helper');
const { getSchema } = require('../../initializers/database');

const AccountNotLoggedInError = require('../../errors/account-not-logged-in-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const POST = async (req, res, next, table, tableId) => {
    logger.debug('common-response-helper-comment.POST', req.log);

    const schema = getSchema(table);

    if (schema.security.account && !req.account.id) {
        return next(new AccountNotLoggedInError);
    }

    const table_has_comment = `${table}_has_comment`;
    const table_id = `${table}_id`;
    const accountId = req.account.id;
    const comment = req.body.comment;

    try {
        const comment_id = SQLHelper.INSERT('comment', { account_id: accountId, comment });
        await SQLHelper.INSERT(table_has_comment, { [table_id]: tableId, comment_id });

        res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    POST,
};
