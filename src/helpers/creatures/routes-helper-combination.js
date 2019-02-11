'use strict';

const combinationResponseHelper = require('./response-helper-combination');

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const corporationRoutes = (router) => {
    router.route('/:id/corporation')
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'corporation.id, ' +
                'corporation.name, ' +
                'corporation.description ' +
                'FROM creature_is_corporation ' +
                'LEFT JOIN corporation ON corporation.id = creature_is_corporation.corporation_id ' +
                'WHERE creature_is_corporation.creature_id = ?';

            await combinationResponseHelper.GET(req, res, next, query, req.params.id);
        });
};

const countryRoutes = (router) => {
    router.route('/:id/corporation')
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'country.id, ' +
                'country.name, ' +
                'country.description ' +
                'FROM creature_is_country ' +
                'LEFT JOIN country ON country.id = creature_is_country.country_id ' +
                'WHERE creature_is_country.creature_id = ?';

            await combinationResponseHelper.GET(req, res, next, query, req.params.id);
        });
};

const epochRoutes = (router) => {
    router.route('/:id/corporation')
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'epoch.id, ' +
                'epoch.name, ' +
                'epoch.description ' +
                'FROM creature ' +
                'LEFT JOIN epoch ON epoch.id = creature.epoch_id ' +
                'WHERE creature.id = ?';

            await combinationResponseHelper.GET(req, res, next, query, req.params.id);
        });
};

const identityRoutes = (router) => {
    router.route('/:id/corporation')
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'identity.id, ' +
                'identity.name, ' +
                'identity.description, ' +
                'identity.icon ' +
                'FROM creature_is_identity ' +
                'LEFT JOIN identity ON identity.id = creature_is_identity.identity_id ' +
                'WHERE creature_is_identity.creature_id = ?';

            await combinationResponseHelper.GET(req, res, next, query, req.params.id);
        });
};

const natureRoutes = (router) => {
    router.route('/:id/corporation')
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'nature.id, ' +
                'nature.name, ' +
                'nature.description, ' +
                'nature.icon ' +
                'FROM creature_is_nature ' +
                'LEFT JOIN nature ON nature.id = creature_is_nature.nature_id ' +
                'WHERE creature_is_nature.creature_id = ?';

            await combinationResponseHelper.GET(req, res, next, query, req.params.id);
        });
};

const speciesRoutes = (router) => {
    router.route('/:id/corporation')
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'species.id, ' +
                'species.name, ' +
                'species.description, ' +
                'species.icon, ' +
                'species.manifestation, ' +
                'species.max_age, ' +
                'species.multiply_points ' +
                'FROM creature_is_species ' +
                'LEFT JOIN species ON species.id = creature_is_species.species_id ' +
                'WHERE creature_is_species.creature_id = ?';

            await combinationResponseHelper.GET(req, res, next, query, req.params.id);
        });
};

const wealthRoutes = (router) => {
    router.route('/:id/corporation')
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'wealth.id, ' +
                'wealth.name, ' +
                'wealth.description, ' +
                'wealth.icon ' +
                'FROM creature_is_wealth ' +
                'LEFT JOIN wealth ON wealth.id = creature_is_wealth.wealth_id ' +
                'WHERE creature_is_wealth.creature_id = ?';

            await combinationResponseHelper.GET(req, res, next, query, req.params.id);
        });
};

const worldRoutes = (router) => {
    router.route('/:id/corporation')
        .get(async (req, res, next) => {
            const query = 'SELECT ' +
                'world.id, ' +
                'world.name, ' +
                'world.description ' +
                'FROM creature ' +
                'LEFT JOIN epoch ON epoch.id = creature.epoch_id ' +
                'LEFT JOIN world ON world.id = epoch.world_id ' +
                'WHERE creature.id = ?';

            await combinationResponseHelper.GET(req, res, next, query, req.params.id);
        });
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    corporationRoutes,
    countryRoutes,
    epochRoutes,
    identityRoutes,
    natureRoutes,
    speciesRoutes,
    wealthRoutes,
    worldRoutes,
};
