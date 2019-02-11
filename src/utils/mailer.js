const nconf = require('nconf');
const { readSync } = require('node-yaml');
const { apiKey, domain } = readSync('../../config/mailgun.yml');
const { Mailer } = require('spelwerk-service-utility');

const mailer = new Mailer(apiKey, domain, nconf.get('admin:noreply'));

if (process.env.NODE_ENV === 'production') {
    mailer.setProduction(true);
}

module.exports = mailer;
