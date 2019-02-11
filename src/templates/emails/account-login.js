'use strict';

let nconf = require('nconf');

module.exports = (email, secret, timeout) => {
    return (
        '<b>Hello!</b>' +
        '<br/>' +
        'Use the following verification code to login to your account: ' +
        '<br/>' +
        '<a href="' + nconf.get('links:base') + nconf.get('links:account:login') + secret + '">' + secret + '</a>' +
        '<br/>' +
        'This code will expire on : ' + timeout + ' or until it is used.' +
        '<br/>');
};
