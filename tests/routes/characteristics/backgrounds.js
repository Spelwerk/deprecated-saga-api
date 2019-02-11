'use strict';

const _ = require('lodash');
const { assert } = require('chai');
const request = require('../../request');
const { randomHex, randomNumber, getLatestIdFromArray, getRandomIdFromArray, assertRelation } = require('../../utils');

describe('/characteristics/backgrounds', () => {
    before(async () => { await request.SESSION(); });

    const baseRoute = '/characteristics/backgrounds';
    const hex = randomHex(20);
    let id;

    const assertRoot = (body) => {
        assert.isArray(body.results);

        _.forEach(body.results, (item) => {
            assert.isNumber(item.id);
            assert.isBoolean(item.canon);
            assert.isString(item.name);
            assert.isString(item.created);
            assert.isString(item.updated);
        });
    };

    const assertId = (body) => {
        assert.isObject(body.result);

        assert.isNumber(body.result.id);
        assert.isBoolean(body.result.canon);
        assert.isString(body.result.name);

        assert.isNumber(body.result.owner.id);
        assert.isString(body.result.owner.name);
    };

    // default

    it('/ POST', async () => {
        const route = `${baseRoute}`;
        const payload = {
            name: hex,
            description: hex,
            icon: hex,
        };
        const body = await request.POST(201, route, payload);
        assert.isNumber(body.id);
        id = body.id;
    });

    it('/ GET', async () => {
        const route = `${baseRoute}`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    it('/deleted GET', async () => {
        const route = `${baseRoute}/deleted`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    it('/hidden GET', async () => {
        const route = `${baseRoute}/hidden`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    it('/schema GET', async () => {
        const route = `${baseRoute}/schema`;
        const body = await request.GET(200, route);
        assert.isObject(body);
    });

    it('/:id GET', async () => {
        const route = `${baseRoute}/${id}`;
        const body = await request.GET(200, route);
        assertId(body);
    });

    it('/:id PUT', async () => {
        const route = `${baseRoute}/${id}`;
        const payload = {
            name: hex + '-PUT',
            description: hex + '-PUT',
        };
        await request.PUT(204, route, payload);
    });

    it('/:id CANON', async () => {
        const route = `${baseRoute}/${id}/canon/1`;
        await request.PUT(204, route);
    });

    // special

    it('/manifestation/:id GET', async () => {
        const route = `${baseRoute}/manifestation/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    it('/species/:id GET', async () => {
        const route = `${baseRoute}/species/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    // armours

    describe('/:id/armours', () => {
        let relationId;

        before(async () => {
            const route = `/combat/armours`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/armours`;
            const payload = {
                armour_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/armours`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // assets

    describe('/:id/assets', () => {
        let relationId;

        before(async () => {
            const route = `/assets/assets`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/assets`;
            const payload = {
                asset_id: relationId,
                value: randomNumber(1,10),
            };
            await request.POST(204, route, payload);
        });

        it('PUT', async () => {
            const route = `${baseRoute}/${id}/assets/${relationId}`;
            const payload = {
                value: randomNumber(1,10),
            };
            await request.PUT(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/assets`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // attributes

    describe('/:id/attributes', () => {
        let relationId;

        before(async () => {
            const route = `/abilities/attributes`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/attributes`;
            const payload = {
                attribute_id: relationId,
                value: randomNumber(1,5),
            };
            await request.POST(204, route, payload);
        });

        it('PUT', async () => {
            const route = `${baseRoute}/${id}/attributes/${relationId}`;
            const payload = {
                value: randomNumber(1,5),
            };
            await request.PUT(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/attributes`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // bionics

    describe('/:id/bionics', () => {
        let relationId;

        before(async () => {
            const route = `/assets/bionics`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/bionics`;
            const payload = {
                bionic_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/bionics`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // primals

    describe('/:id/primals', () => {
        let relationId;

        before(async () => {
            const route = `/magic/primals`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/primals`;
            const payload = {
                primal_id: relationId,
                value: randomNumber(1,5),
            };
            await request.POST(204, route, payload);
        });

        it('PUT', async () => {
            const route = `${baseRoute}/${id}/primals/${relationId}`;
            const payload = {
                value: randomNumber(1,5),
            };
            await request.PUT(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/primals`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // shields

    describe('/:id/shields', () => {
        let relationId;

        before(async () => {
            const route = `/combat/shields`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/shields`;
            const payload = {
                shield_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/shields`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // skills

    describe('/:id/skills', () => {
        let relationId;

        before(async () => {
            const route = `/abilities/skills`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/skills`;
            const payload = {
                skill_id: relationId,
                value: randomNumber(1,5),
            };
            await request.POST(204, route, payload);
        });

        it('PUT', async () => {
            const route = `${baseRoute}/${id}/skills/${relationId}`;
            const payload = {
                value: randomNumber(1,5),
            };
            await request.PUT(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/skills`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // weapons

    describe('/:id/weapons', () => {
        let relationId;

        before(async () => {
            const route = `/combat/weapons`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/weapons`;
            const payload = {
                weapon_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/weapons`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });
});
