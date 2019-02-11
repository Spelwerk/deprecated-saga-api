'use strict';

const _ = require('lodash');
const { assert } = require('chai');
const crypto = require('crypto');

const randomHex = (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0, length);
};

const randomNumber = (min, max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
};

const getRandomIdFromArray = (array) => {
    const position = array.length - 1;
    const rand = randomNumber(0, position);
    return array[rand].id;
};

const getLatestIdFromArray = (array) => {
    const position = array.length - 1;
    return array[position].id;
};

const assertRelation = (body) => {
    assert.isArray(body.results);

    _.forEach(body.results, (item) => {
        assert.isNumber(item.id);
        assert.isString(item.name);
    });
};

module.exports = {
    randomHex,
    randomNumber,
    getRandomIdFromArray,
    getLatestIdFromArray,
    assertRelation,
};
