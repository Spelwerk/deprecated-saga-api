'use strict';

let AppError = require('./app-error');

class AccountInvalidPasswordError extends AppError {
    constructor(secret) {
        super(400,
            "Invalid Password",
            "The password you typed is not correct. Did you type it correctly?");

        this.secret = secret;
    }
}

module.exports = AccountInvalidPasswordError;
