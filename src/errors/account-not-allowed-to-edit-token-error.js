'use strict';

let AppError = require('./app-error');

class AccountNotAllowedToEditTokenError extends AppError {
    constructor() {
        super(403,
            "Forbidden",
            "The request could not be completed due to the account not being allowed to edit this token");
    }
}

module.exports = AccountNotAllowedToEditTokenError;
