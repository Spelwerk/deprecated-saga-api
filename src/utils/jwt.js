const nconf = require('nconf');
const { JWT } = require('spelwerk-service-utility');
const { Expiry } = require('../constants');

const jwt = new JWT(nconf.get('secrets:jwt'), nconf.get('links:base'));

const encodeRefreshToken = () => {
    return jwt.getRefreshToken(Expiry.TOKENS.REFRESH_DAYS);
};

const encodeAccessToken = (accountDetails) => {
    return jwt.getAccessToken(accountDetails, Expiry.TOKENS.ACCESS_MINUTES);
};

const decodeToken = (token) => {
    return jwt.decodeToken(token);
};

module.exports = {
    encodeRefreshToken,
    encodeAccessToken,
    decodeToken,
};
