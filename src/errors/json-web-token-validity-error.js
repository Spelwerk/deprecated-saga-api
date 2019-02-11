'use strict';

let AppError = require('./app-error');

class JSONWebTokenError extends AppError {
    constructor() {
        super(403,
            "Invalid Token",
            "An error occured when trying to validate content in the token");
    }
}

module.exports = JSONWebTokenError;
