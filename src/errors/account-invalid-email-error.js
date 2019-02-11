'use strict';

let AppError = require('./app-error');

class AccountInvalidEmailError extends AppError {
    constructor() {
        super(400,
            "Invalid Email",
            "The email you provided does not exist in our database. Did you type it correctly?");
    }
}

module.exports = AccountInvalidEmailError;
