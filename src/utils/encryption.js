const nconf = require('nconf');
const { Encryption } = require('spelwerk-service-utility');

const encryption = new Encryption(nconf.get('secrets:aes'), nconf.get('secrets.sha'), nconf.get('salt'));

module.exports = encryption;
