'use strict';

let AppError = require('./app-error');

class AccountNotLoggedInError extends AppError {
    constructor() {
        super(403,
            "Account not logged in",
            "The request could not be completed due to the server not finding a logged in account");
    }
}

module.exports = AccountNotLoggedInError;
