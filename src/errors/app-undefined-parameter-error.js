'use strict';

let AppError = require('./app-error');

class UndefinedParameterError extends AppError {
    constructor(key) {
        super(500,
            `Required parameter is undefined`,
            `The parameter [ ${key} ] is undefined.`);
    }
}

module.exports = UndefinedParameterError;
