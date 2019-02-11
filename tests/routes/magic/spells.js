'use strict';

const _ = require('lodash');
const { assert } = require('chai');
const request = require('../../request');
const { randomHex, randomNumber, getLatestIdFromArray, getRandomIdFromArray, assertRelation } = require('../../utils');

describe('/magic/spells', () => {
    before(async () => { await request.SESSION(); });

    const baseRoute = '/magic/spells';
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
        assert.isNumber(body.result.cost);
        assert.isNumber(body.result.distance);

        assert.isNumber(body.result.effect.dice);
        assert.isNumber(body.result.effect.bonus);

        assert.isNumber(body.result.damage.id);
        assert.isString(body.result.damage.name);
        assert.isNumber(body.result.damage.dice);
        assert.isNumber(body.result.damage.bonus);

        assert.isNumber(body.result.critical.dice);
        assert.isNumber(body.result.critical.bonus);

        assert.isNumber(body.result.type.id);
        assert.isString(body.result.type.name);

        assert.isNumber(body.result.manifestation.id);
        assert.isString(body.result.manifestation.name);

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
            effects: hex,
            spell_type_id: 1,
            attribute_id: 1,
            cost: randomNumber(1,10),
            distance: randomNumber(1,100),
            effect_dice: randomNumber(1,9),
            effect_bonus: randomNumber(1,9),
            damage_dice: randomNumber(1,9),
            damage_bonus: randomNumber(1,9),
            critical_dice: randomNumber(1,9),
            critical_bonus: randomNumber(1,9),
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

    it('/type/:id GET', async () => {
        const route = `${baseRoute}/type/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });

    it('/manifestation/:id GET', async () => {
        const route = `${baseRoute}/manifestation/1`;
        const body = await request.GET(200, route);
        assertRoot(body);
    });
});
