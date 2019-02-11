'use strict';

let AppError = require('./app-error');

class AccountOTPNotFoundError extends AppError {
    constructor() {
        super(403,
            "Account OTP not found",
            "The requested account has not yet created a OTP");
    }
}

module.exports = AccountOTPNotFoundError;
