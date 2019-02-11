'use strict';

let nconf = require('nconf');

module.exports = (email, secret, timeout) => {
    const href = `${nconf.get('links:base')}${nconf.get('links:account:login')}${email}/${secret}`;

    return (
        '<b>Hello!</b>' +
        '<br/>' +
        'Use the following verification code to change your email: ' +
        '<br/>' +
        '<a href="' + href + '">' + secret + '</a>' +
        '<br/>' +
        'This code will expire on : ' + timeout + ' or until it is used.' +
        '<br/>');
};
