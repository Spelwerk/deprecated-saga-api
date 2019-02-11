'use strict';

let AppError = require('./app-error');

class AccountHasNoRolesError extends AppError {
    constructor() {
        super(400,
            "Account has no roles",
            "There are no roles listed for this account.");
    }
}

module.exports = AccountHasNoRolesError;
