'use strict';

const logger = require('../../logger/winston');
const { SELECT } = require('../common/sql-helper');
const { validator } = require('../../utils');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const emailExists = async (email) => {
    logger.debug('accounts/sql-helper-exists.emailExists');

    email = email.toLowerCase();

    const rows = await SELECT('account', ['id'], { email });

    return rows && rows.length > 0;
};

const displayNameExists = async (displayName) => {
    logger.debug('accounts/sql-helper-exists.displayNameExists');

    displayName = displayName.toLowerCase();

    const rows = await SELECT('account', ['id'], { display_name: displayName });

    return rows && rows.length > 0;
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    emailExists,
    displayNameExists,
};
