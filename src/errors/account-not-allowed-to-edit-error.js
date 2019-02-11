'use strict';

let AppError = require('./app-error');

class AccountNotAllowedToEditError extends AppError {
    constructor() {
        super(403,
            "Forbidden",
            "The request could not be completed due to the account not being allowed to edit this row");
    }
}

module.exports = AccountNotAllowedToEditError;
