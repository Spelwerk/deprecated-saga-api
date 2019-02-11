'use strict';

module.exports = (router) => {
    router.route('/')
        .get((req, res) => {
            res.status(200).send({success: true});
        });
};
