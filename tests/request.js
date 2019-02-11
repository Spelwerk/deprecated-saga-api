'use strict';

const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const path = require('path');

const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = require('chai');
const { readSync } = require('node-yaml');
const { TokenKey } = require('../src/constants');
const development = readSync('../config/development.yml');

global.config = {
    base: `http://localhost:${development.port}`,
    api: {
        id: development.apiKey.id,
        secret: development.apiKey.secret,
    },
    admin: {
        email: development.admin.email,
        password: development.admin.password,
    },
    tokens: {
        uuid: '',
        refresh: '',
        access: '',
    }
};

const LOGIN = async (email, password) => {
    email = email || config.admin.email;
    password = password || config.admin.password;

    const response = await chai.request(config.base)
        .post('/accounts/login/password')
        .auth(config.api.id, config.api.secret)
        .send({
            email,
            password,
        });

    expect(response).to.have.status(200);

    const { refreshToken, accessToken } = response.body;

    global.config.tokens.refresh = refreshToken;
    global.config.tokens.access = accessToken;
};

const SESSION = async () => {
    if (!global.config.tokens.access) {
        await LOGIN();
    }
};

const POST = async (expectedStatus, path, payload) => {
    const response = await chai.request(config.base)
        .post(path)
        .auth(config.api.id, config.api.secret)
        .set({
            [TokenKey.ACCESS]: global.config.tokens.access,
            [TokenKey.REFRESH]: global.config.tokens.refresh,
        })
        .send(payload);

    expect(response).to.have.status(expectedStatus);

    return response.body;
};

const GET = async (expectedStatus, path) => {
    const response = await chai.request(config.base)
        .get(path)
        .auth(config.api.id, config.api.secret)
        .set({
            [TokenKey.ACCESS]: global.config.tokens.access,
            [TokenKey.REFRESH]: global.config.tokens.refresh,
        });

    expect(response).to.have.status(expectedStatus);

    return response.body;
};

const PUT = async (expectedStatus, path, payload) => {
    const response = await chai.request(config.base)
        .put(path)
        .auth(config.api.id, config.api.secret)
        .set({
            [TokenKey.ACCESS]: global.config.tokens.access,
            [TokenKey.REFRESH]: global.config.tokens.refresh,
        })
        .send(payload);

    expect(response).to.have.status(expectedStatus);

    return response.body;
};

const DELETE = async (expectedStatus, path) => {
    const response = await chai.request(config.base)
        .delete(path)
        .auth(config.api.id, config.api.secret)
        .set({
            [TokenKey.ACCESS]: global.config.tokens.access,
            [TokenKey.REFRESH]: global.config.tokens.refresh,
        });

    expect(response).to.have.status(expectedStatus);

    return response.body;
};

const getSecretFromFile = async () => {
    return await readFile(path.join(__dirname, 'secret'), 'utf8');
};

const getOTPTokenFromFile = async () => {
    return await readFile(path.join(__dirname, 'otp'), 'utf8');
};

module.exports = {
    LOGIN,
    SESSION,
    POST,
    GET,
    PUT,
    DELETE,
    getSecretFromFile,
    getOTPTokenFromFile,
};
