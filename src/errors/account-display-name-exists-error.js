'use strict';

let AppError = require('./app-error');

class AccountDisplayNameExistsError extends AppError {
    constructor() {
        super(400,
            "Display Name already exists",
            "The display name is already taken!");
    }
}

module.exports = AccountDisplayNameExistsError;
