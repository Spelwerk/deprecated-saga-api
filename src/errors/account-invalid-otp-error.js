'use strict';

let AppError = require('./app-error');

class AccountInvalidOTPError extends AppError {
    constructor() {
        super(403,
            "Invalid OTP",
            "The OTP you typed is not correct. Did you type it correctly?");
    }
}

module.exports = AccountInvalidOTPError;
