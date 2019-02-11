'use strict';

let AppError = require('./app-error');

class AccountExpiredTimeoutError extends AppError {
    constructor() {
        super(400,
            "Timeout Expired",
            "The timeout period has expired. A new secret needs to be generated and sent to your email");
    }
}

module.exports = AccountExpiredTimeoutError;
