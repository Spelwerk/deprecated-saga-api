'use strict';

const _ = require('lodash');
const { assert } = require('chai');
const request = require('../../request');
const { randomHex, randomNumber, getLatestIdFromArray, getRandomIdFromArray, assertRelation } = require('../../utils');

describe('/assets/bionics', () => {
    before(async () => { await request.SESSION(); });

    const baseRoute = '/assets/bionics';
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
        assert.isBoolean(body.result.isLegal);
        assert.isNumber(body.result.price);
        assert.isString(body.result.created);
        assert.isString(body.result.updated);
        assert.isNumber(body.result.hacking.difficulty);

        assert.isNumber(body.result.bodyPart.id);
        assert.isString(body.result.bodyPart.name);

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
            body_part_id: 1,
            legal: true,
            price: randomNumber(1,10),
            hacking_difficulty: randomNumber(1,10),
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

    it('/body-part/:id GET', async () => {
        const route = `${baseRoute}/body-part/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
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

    // augmentations

    describe('/:id/augmentations', () => {
        let relationId;

        before(async () => {
            const route = `/assets/augmentations`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/augmentations`;
            const payload = {
                augmentation_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/augmentations`;
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

    // software

    describe('/:id/software', () => {
        let relationId;

        before(async () => {
            const route = `/assets/software`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/software`;
            const payload = {
                software_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/software`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });
});
