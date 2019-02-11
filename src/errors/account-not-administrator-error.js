'use strict';

let AppError = require('./app-error');

class AccountNotAdministratorError extends AppError {
    constructor() {
        super(403,
            "Forbidden",
            "The request could not be completed due to the account not being an administrator");
    }
}

module.exports = AccountNotAdministratorError;
