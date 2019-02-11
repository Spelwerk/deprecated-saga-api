'use strict';

let AppError = require('./app-error');

class AccountInvalidSecretError extends AppError {
    constructor(secret) {
        super(400,
            "Invalid Secret",
            "The secret provided in the request is invalid");

        this.secret = secret;
    }
}

module.exports = AccountInvalidSecretError;
