'use strict';

let AppError = require('./app-error');

class AccountEmailExistsError extends AppError {
    constructor() {
        super(400,
            "Email already exists",
            "The email is already taken!");
    }
}

module.exports = AccountEmailExistsError;
