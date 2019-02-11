'use strict';

let AppError = require('./app-error');

class AccountNotVerifiedError extends AppError {
    constructor() {
        super(403,
            "Account not verified",
            "The request could not be completed due to the account not being verified yet");
    }
}

module.exports = AccountNotVerifiedError;
