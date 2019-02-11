'use strict';

let AppError = require('./app-error');

class MissingParameterError extends AppError {
    constructor(key) {
        super(500,
            `Required parameter is missing`,
            `The parameter [ ${key} ] is missing.`);
    }
}

module.exports = MissingParameterError;
