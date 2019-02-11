'use strict';

const _ = require('lodash');
const constants = require('../constants');
const { getSchema } = require('../initializers/database');

module.exports = (router) => {
    router.route('/')
        .get((req, res) => {
            res.status(200).send({success: true});
        });

    router.route('/constants')
        .get((req, res) => {
            res.status(200).send({
                CreatureCalculation: constants.CreatureCalculation,
                CreatureCosts: constants.CreatureCosts,
                CreaturePoints: constants.CreaturePoints,
                Dice: constants.Dice,
                HeaderKey: constants.HeaderKey,
            });
        });

    router.route('/plural')
        .get((req, res) => {
            res.status(200).send({
                Plural: constants.Plural,
            });
        });

    router.route('/schema/:table')
        .get((req, res) => {
            const schema = getSchema([req.params.table]);
            const result = {
                security: schema.security,
                supports: schema.supports,
                fields: schema.fields.options,
                tables: schema.tables,
            };

            res.status(200).send(result);
        });
};
