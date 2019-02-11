'use strict';

let AppError = require('./app-error');

class AccountNotFoundError extends AppError {
    constructor() {
        super(403,
            "Account not found",
            "The requested account was not found");
    }
}

module.exports = AccountNotFoundError;
