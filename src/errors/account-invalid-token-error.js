'use strict';

let AppError = require('./app-error');

class AccountInvalidTokenError extends AppError {
    constructor() {
        super(401,
            "Invalid token",
            "The token provided in the request is invalid");
    }
}

module.exports = AccountInvalidTokenError;
