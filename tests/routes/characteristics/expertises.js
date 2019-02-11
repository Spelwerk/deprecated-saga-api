'use strict';

const _ = require('lodash');
const { assert } = require('chai');
const request = require('../../request');
const { randomHex, randomNumber, getLatestIdFromArray, getRandomIdFromArray, assertRelation } = require('../../utils');

describe('/characteristics/expertises', () => {
    before(async () => { await request.SESSION(); });

    const baseRoute = '/characteristics/expertises';
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
        assert.isString(body.result.created);
        assert.isString(body.result.updated);

        assert.isNumber(body.result.skill.id);
        assert.isString(body.result.skill.name);
        assert.isNumber(body.result.skill.requirement);
        assert.isNumber(body.result.skill.dice);
        assert.isNumber(body.result.skill.bonus);

        assert.isNumber(body.result.owner.id);
        assert.isString(body.result.owner.name);
    };

    // default

    it('/ POST', async () => {
        const route = `${baseRoute}`;
        const payload = {
            name: hex,
            description: hex,
            skill_id: 1,
            skill_requirement: randomNumber(1,4),
            maximum: randomNumber(1,4),
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

    it('/skill/:id GET', async () => {
        const route = `${baseRoute}/skill/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    it('/species/:id GET', async () => {
        const route = `${baseRoute}/species/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    it('/skill/:id/manifestation/:id GET', async () => {
        const route = `${baseRoute}/skill/1/manifestation/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    it('/skill/:id/species/:id GET', async () => {
        const route = `${baseRoute}/skill/1/species/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });
});
