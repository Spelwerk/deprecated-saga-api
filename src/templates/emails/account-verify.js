'use strict';

let nconf = require('nconf');

module.exports = (email, secret, timeout) => {
    const href = `${nconf.get('links:base')}${nconf.get('links:account:verify')}${email}/${secret}`;

    return (
        '<b>Hello!</b>' +
        '<br/>' +
        'Use the following verification code to verify your account creation: ' +
        '<br/>' +
        '<a href="' + href + '">' + secret + '</a>' +
        '<br/>' +
        'This code will expire on : ' + timeout + ' or until it is used.' +
        '<br/>');
};
