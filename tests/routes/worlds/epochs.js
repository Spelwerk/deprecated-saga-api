'use strict';

const _ = require('lodash');
const { assert } = require('chai');
const request = require('../../request');
const { randomHex, randomNumber, getLatestIdFromArray, getRandomIdFromArray, assertRelation } = require('../../utils');

describe('/worlds/epochs', () => {
    before(async () => { await request.SESSION(); });

    const baseRoute = '/worlds/epochs';
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

        assert.isBoolean(body.result.hasAugmentation);

        assert.isNumber(body.result.world.id);
        assert.isString(body.result.world.name);

        assert.isNumber(body.result.owner.id);
        assert.isString(body.result.owner.name);
    };

    // default

    it('/ POST', async () => {
        const route = `${baseRoute}`;
        const payload = {
            name: hex,
            description: hex,
            history: hex,
            world_id: 2,
            begins: randomNumber(0,1000),
            ends: randomNumber(1001,2000),
            augmentation: true,
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
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/assets`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // backgrounds

    describe('/:id/backgrounds', () => {
        let relationId;

        before(async () => {
            const route = `/characteristics/backgrounds`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/backgrounds`;
            const payload = {
                background_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/backgrounds`;
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

    // corporations

    describe('/:id/corporations', () => {
        let relationId;

        before(async () => {
            const route = `/worlds/corporations`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/corporations`;
            const payload = {
                corporation_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/corporations`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // countries

    describe('/:id/countries', () => {
        let relationId;

        before(async () => {
            const route = `/worlds/countries`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/countries`;
            const payload = {
                country_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/countries`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // expertises

    describe('/:id/expertises', () => {
        let relationId;

        before(async () => {
            const route = `/characteristics/expertises`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/expertises`;
            const payload = {
                expertise_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/expertises`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // gifts

    describe('/:id/gifts', () => {
        let relationId;

        before(async () => {
            const route = `/characteristics/gifts`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/gifts`;
            const payload = {
                gift_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/gifts`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // imperfections

    describe('/:id/imperfections', () => {
        let relationId;

        before(async () => {
            const route = `/characteristics/imperfections`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/imperfections`;
            const payload = {
                imperfection_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/imperfections`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // locations

    describe('/:id/locations', () => {
        let relationId;

        before(async () => {
            const route = `/worlds/locations`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/locations`;
            const payload = {
                location_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/locations`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // manifestations

    describe('/:id/manifestations', () => {
        let relationId;

        before(async () => {
            const route = `/magic/manifestations`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/manifestations`;
            const payload = {
                manifestation_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/manifestations`;
            const body = await request.GET(200, route);
            assertRelation(body);
        });
    });

    // milestones

    describe('/:id/milestones', () => {
        let relationId;

        before(async () => {
            const route = `/characteristics/milestones`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/milestones`;
            const payload = {
                milestone_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/milestones`;
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
            };
            await request.POST(204, route, payload);
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

    // wealth

    describe('/:id/wealth', () => {
        let relationId;

        before(async () => {
            const route = `/assets/wealth`;
            const body = await request.GET(200, route);
            relationId = getRandomIdFromArray(body.results);
        });

        it('POST', async () => {
            const route = `${baseRoute}/${id}/wealth`;
            const payload = {
                wealth_id: relationId,
            };
            await request.POST(204, route, payload);
        });

        it('GET', async () => {
            const route = `${baseRoute}/${id}/wealth`;
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
