'use strict';

let AppError = require('./app-error');

class WrongParamTypeError extends AppError {
    constructor(key, expected, actual) {
        super(500,
            `Parameter is of the wrong type`,
            `The parameter [ ${key} ] is wrong. Expected: [ ${expected} ] - Actual: [ ${actual} ]`);
    }
}

module.exports = WrongParamTypeError;
