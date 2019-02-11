'use strict';

let AppError = require('./app-error');

class AccountLockedError extends AppError {
    constructor() {
        super(403,
            "Account has been locked",
            "The account has been locked. Please contact customer support.");
    }
}

module.exports = AccountLockedError;
