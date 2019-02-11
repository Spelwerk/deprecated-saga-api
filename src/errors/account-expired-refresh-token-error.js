'use strict';

let AppError = require('./app-error');

class AccountExpiredRefreshTokenError extends AppError {
    constructor() {
        super(401, "Expired refresh token", "The token provided in the request has expired");
    }
}

module.exports = AccountExpiredRefreshTokenError;
