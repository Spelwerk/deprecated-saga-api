'use strict';

let AppError = require('./app-error');

class AccountPasswordNotSetError extends AppError {
    constructor() {
        super(400,
            "Password not set",
            "You are trying to log in to an account that has no password. You can only use your email to log in to this account.");
    }
}

module.exports = AccountPasswordNotSetError;
