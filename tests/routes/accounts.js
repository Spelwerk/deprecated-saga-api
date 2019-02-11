'use strict';

const _ = require('lodash');
const { assert } = require('chai');
const request = require('../request');
const { randomHex, randomNumber } = require('../utils');

describe('/accounts', () => {
    const baseRoute = '/accounts';
    const hex = randomHex(20);
    let id;

    const email = `${hex}@fake.email`;
    const displayName = hex;
    const password = hex;

    const verifyLoggedInAndSession = (body) => {
        assert.isString(body.refreshToken);
        global.config.tokens.refresh = body.refreshToken;

        assert.isString(body.accessToken);
        global.config.tokens.access = body.accessToken;

        assert.isObject(body.session);
        assert.isNumber(body.session.expiry);

        assert.isNumber(body.session.id);
        assert.equal(body.session.id, id);

        assert.isObject(body.session.roles);
        assert.isTrue(body.session.roles.USER);
    };

    it('/ POST', async () => {
        const route = `${baseRoute}`;
        const payload = {
            email,
        };
        const body = await request.POST(201, route, payload);

        assert.isNumber(body.id);
        id = body.id;
    });

    it('/verify/send POST', async () => {
        const route = `${baseRoute}/verify/send`;
        const payload = {
            email,
        };
        await request.POST(204, route, payload);
    });

    it('/verify/secret POST', async () => {
        const route = `${baseRoute}/verify/secret`;
        const secret = await request.getSecretFromFile();
        const payload = {
            email,
            secret,
            displayName,
            password,
        };
        const body = await request.POST(200, route, payload);

        assert.isNumber(body.id);
        id = body.id;

        verifyLoggedInAndSession(body);
    });

    it('/ GET', async () => {
        const route = `${baseRoute}`;
        const body = await request.GET(200, route);

        _.forEach(body.results, (item) => {
            assert.isNumber(item.id);
            assert.isString(item.displayName);
            assert.isString(item.created);

            if (item.updated) {
                assert.isString(item.updated);
            }
        });
    });

    it('/exists/display-name/:name GET', async () => {
        const route = `${baseRoute}/exists/display-name/${displayName}`;
        const body = await request.GET(200, route);

        assert.isBoolean(body.exists);
        assert.isTrue(body.exists);
    });

    it('/exists/display-name/:name GET', async () => {
        const route = `${baseRoute}/exists/display-name/i-do-not-expect-this-to-work`;
        const body = await request.GET(200, route);

        assert.isBoolean(body.exists);
        assert.isFalse(body.exists);
    });

    it('/exists/email/:email GET', async () => {
        const route = `${baseRoute}/exists/email/${email}`;
        const body = await request.GET(200, route);

        assert.isBoolean(body.exists);
        assert.isTrue(body.exists);
    });

    it('/exists/email/:email GET', async () => {
        const route = `${baseRoute}/exists/email/i-do-not-expect-this-to-work`;
        const body = await request.GET(200, route);

        assert.isBoolean(body.exists);
        assert.isFalse(body.exists);
    });

    it('/login/password POST', async () => {
        const route = `${baseRoute}/login/password`;
        const payload = {
            email,
            password,
        };
        const body = await request.POST(200, route, payload);

        assert.isString(body.refreshToken);
        global.config.tokens.refresh = body.refreshToken;
    });

    describe('/session', () => {
        it('/ GET', async () => {
            const route = `${baseRoute}/session`;
            const body = await request.GET(200, route);

            assert.isString(body.accessToken);
            global.config.tokens.access = body.accessToken;
        });

        it('/info GET', async () => {
            const route = `${baseRoute}/session/info`;
            const body = await request.GET(200, route);

            const bodyAT = body.tokens.accessToken;
            const bodyRT = body.tokens.refreshToken;

            assert.isObject(bodyAT);
            assert.isString(bodyAT.iss);
            assert.isNumber(bodyAT.iat);
            assert.isNumber(bodyAT.exp);

            assert.isObject(bodyAT.account);
            assert.isNumber(bodyAT.account.id);

            _.forEach(bodyAT.account.roles, (value, key) => {
                assert.isString(key);
                assert.isTrue(value);
            });

            assert.isObject(bodyRT);
            assert.isString(bodyRT.iss);
            assert.isNumber(bodyRT.iat);
            assert.isNumber(bodyRT.exp);
            assert.isString(bodyRT.uuid);

            global.config.tokens.uuid = bodyRT.uuid;
        });
    });

    describe('/tokens', () => {
        it('/refresh GET', async () => {
            const route = `${baseRoute}/tokens/refresh`;
            const body = await request.GET(200, route);

            assert.isArray(body.results);

            _.forEach(body.results, (item) => {
                assert.isString(item.uuid);
            });
        });

        it('/refresh PUT', async () => {
            const route = `${baseRoute}/tokens/refresh`;
            const payload = {
                uuid: global.config.tokens.uuid,
                name: hex,
            };
            await request.PUT(204, route, payload);
        });
    });

    describe('/login', () => {
        it('/send POST', async () => {
            const route = `${baseRoute}/login/send`;
            const payload = {
                email,
            };
            await request.POST(204, route, payload);
        });

        it('/secret POST', async () => {
            const route = `${baseRoute}/login/secret`;
            const secret = await request.getSecretFromFile();
            const payload = {
                email,
                secret,
            };
            const body = await request.POST(200, route, payload);

            verifyLoggedInAndSession(body);
        });
    });

    describe('/change-password', () => {
        it('/send POST', async () => {
            const route = `${baseRoute}/change-password/send`;
            const payload = {
                email,
            };
            await request.POST(204, route, payload);
        });

        it('/secret POST', async () => {
            const route = `${baseRoute}/change-password/secret`;
            const secret = await request.getSecretFromFile();
            const payload = {
                email,
                secret,
                newPassword: hex,
            };
            await request.POST(204, route, payload);
        });
    });

    describe('/change-email', () => {
        it('/send POST', async () => {
            const route = `${baseRoute}/change-email/send`;
            const payload = {
                email,
            };
            await request.POST(204, route, payload);
        });

        it('/secret POST', async () => {
            const route = `${baseRoute}/change-email/secret`;
            const secret = await request.getSecretFromFile();
            const payload = {
                email,
                secret,
                newEmail: `${hex}-2@fake.email`,
            };
            await request.POST(204, route, payload);
        });
    });

    it('/:id GET', async () => {
        const route = `${baseRoute}/${id}`;
        const body = await request.GET(200, route);

        assert.isObject(body.result);
        assert.isNumber(body.result.id);
        assert.isString(body.result.displayName);
        assert.isString(body.result.created);

        if (body.updated) {
            assert.isString(body.updated);
        }
    });

    it('/:id PUT', async () => {
        const route = `${baseRoute}/${id}`;
        const payload = {
            name_first: hex + '-FIRST',
            name_last: hex + '-LAST',
        };
        await request.PUT(204, route, payload);
    });

    it('/:id/display-name PUT', async () => {
        const route = `${baseRoute}/${id}/display-name`;
        const payload = {
            displayName: hex + '-NEW-DN',
        };
        await request.PUT(204, route, payload);
    });

    it('/:id/security-question POST', async () => {
        const route = `${baseRoute}/${id}/security-question`;
        const payload = {
            securityQuestionId: 1,
            answer: hex + '-1',
        };
        await request.POST(204, route, payload);
    });

    it('/:id/security-question GET', async () => {
        const route = `${baseRoute}/${id}/security-question`;
        await request.GET(200, route);
    });

    it('/:id/security-question/:item GET', async () => {
        const route = `${baseRoute}/${id}/security-question/1`;
        const payload = {
            answer: hex + '-1-NEW',
        };
        await request.PUT(204, route, payload);
    });

    it('/:id/security-question/verify GET', async () => {
        const route = `${baseRoute}/${id}/security-question/verify`;
        const result = await request.GET(200, route);
        assert.isNumber(result.id);
        assert.isString(result.text);
    });

    it('/:id/security-question/verify POST', async () => {
        const route = `${baseRoute}/${id}/security-question/verify`;
        const payload = {
            securityQuestionId: 1,
            answer: hex + '-1-NEW',
        };
        await request.POST(204, route, payload);
    });

    it('/:id/one-time-password POST', async () => {
        const route = `${baseRoute}/${id}/one-time-password`;
        const result = await request.POST(200, route);
        assert.isString(result.url);
        assert.isString(result.imageData);

        console.log(id);
        console.log(result);
    });

    describe('/:id/admin', () => {
        before(async () => { await request.LOGIN(); });

        it('/email PUT', async () => {
            const route = `${baseRoute}/${id}/admin/email`;
            const payload = {
                newEmail: `${hex}-3@fake.email`,
            };
            await request.PUT(204, route, payload);
        });

        it('/password PUT', async () => {
            const route = `${baseRoute}/${id}/admin/password`;
            const payload = {
                newPassword: hex,
            };
            await request.PUT(204, route, payload);
        });
    });
});
