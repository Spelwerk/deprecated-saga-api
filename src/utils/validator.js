'use strict';

const _ = require('lodash');

const MissingParameterError = require('../errors/app-missing-parameter-error');
const UndefinedParameterError = require('../errors/app-undefined-parameter-error');
const WrongParamTypeError = require('../errors/app-wrong-param-type-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const getType = (key, value) => {
    const type = typeof value;

    if (type === 'undefined') {
        throw new UndefinedParameterError(key);
    }

    if (value === null) {
        throw new MissingParameterError(key);
    }

    return type.toString();
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const isArray = (key, param) => {
    const type = getType(key, param);

    if (!Array.isArray(param)) {
        throw new WrongParamTypeError(key, 'array', type);
    }
};

const isBoolean = (key, param) => {
    const type = getType(key, param);

    if (type !== 'boolean') {
        throw new WrongParamTypeError(key, 'boolean', type);
    }
};

const isEmail = (key, param) => {
    const type = getType(key, param);

    if (type !== 'string' && param.indexOf('@') === -1) {
        throw new WrongParamTypeError(key, 'email', type);
    }
};

const isNumber = (key, param) => {
    const type = getType(key, param);

    if (type !== 'number') {
        throw new WrongParamTypeError(key, 'number', type);
    }
};

const isObject = (key, param) => {
    const type = getType(key, param);

    if (type !== 'object') {
        throw new WrongParamTypeError(key, 'object', type);
    }
};

const isSecret = (key, param) => {
    const type = getType(key, param);

    if (type !== 'string') {
        throw new WrongParamTypeError(key, 'secret', type);
    }

    if (param.length !== 67) {
        throw new WrongParamTypeError(key, 'secret', type);
    }

    if (param.match(/\-/g).length !== 3) {
        throw new WrongParamTypeError(key, 'secret', type);
    }
};

const isString = (key, param) => {
    const type = getType(key, param);

    if (type !== 'string') {
        throw new WrongParamTypeError(key, 'string', type);
    }
};

const isUUID = (key, param) => {
    const type = getType(key, param);

    if (type !== 'string') {
        throw new WrongParamTypeError(key, 'uuid', type);
    }

    if (param.length !== 36) {
        throw new WrongParamTypeError(key, 'uuid', type);
    }

    if (param.match(/\-/g).length !== 4) {
        throw new WrongParamTypeError(key, 'uuid', type);
    }
};

const validateType = (expect, key, param) => {
    switch (expect) {
        case 'array':
            return isArray(key, param);
        case 'boolean':
            return isBoolean(key, param);
        case 'email':
            return isEmail(key, param);
        case 'number':
            return isNumber(key, param);
        case 'object':
            return isObject(key, param);
        case 'secret':
            return isSecret(key, param);
        case 'string':
            return isString(key, param);
        case 'uuid':
            return isUUID(key, param);
        default:
            return;
    }
};

const validate = (array) => {
    _.forEach(array, (object) => {
        _.forEach(object.params, (param, key) => {
            validateType(object.expect, key, param);
        });
    });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = validate;
