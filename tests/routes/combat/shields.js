'use strict';

const _ = require('lodash');
const { assert } = require('chai');
const request = require('../../request');
const { randomHex, randomNumber, getLatestIdFromArray, getRandomIdFromArray, assertRelation } = require('../../utils');

describe('/combat/shields', () => {
    before(async () => { await request.SESSION(); });

    const baseRoute = '/combat/shields';
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
        assert.isNumber(body.result.price);
        assert.isBoolean(body.result.isHeavy);
        assert.isString(body.result.created);
        assert.isString(body.result.updated);

        assert.isNumber(body.result.damage.id);
        assert.isString(body.result.damage.name);
        assert.isNumber(body.result.damage.dice);
        assert.isNumber(body.result.damage.bonus);

        assert.isNumber(body.result.critical.dice);
        assert.isNumber(body.result.critical.bonus);

        assert.isNumber(body.result.expertise.id);
        assert.isString(body.result.expertise.name);

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
            price: randomNumber(1,10),
            attribute_id: 1,
            expertise_id: 1,
            damage_dice: randomNumber(1,4),
            damage_bonus: randomNumber(1,4),
            critical_dice: randomNumber(1,4),
            critical_bonus: randomNumber(1,4),
            heavy: true,
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

});
