'use strict';

const environment = process.env.NODE_ENV || 'development';

const formatter = require('mysql2');
const mysql = require('mysql2/promise');
const nconf = require('nconf');

nconf.file({
    file: './../config/' + environment + '.yml',
    format: require('nconf-yaml')
});

const config = nconf.get('database');

const { encryption, jwt } = require('../src/utils');

async function install() {
    try {
        const pool = mysql.createPool(config);

        const id = 1;
        const email = nconf.get('admin:email');
        const password = await encryption.onionEncrypt(nconf.get('admin:password'));
        const displayName = nconf.get('admin:displayName');
        const { refreshToken, uuid } = jwt.encodeRefreshToken();

        const accountQuery = 'INSERT INTO account (id,email,password,display_name,is_verified) VALUES (?,?,?,?,1) ON DUPLICATE KEY UPDATE email = ?, password = ?, display_name = ?, is_verified = 1';
        const accountParams = [id, email, password, displayName, email, password, displayName];
        const accountFormatted = formatter.format(accountQuery, accountParams);

        const accountResult = await pool.query(accountFormatted);

        if (accountResult[0].insertId !== id) {
            console.error('ERROR', 'accountResult is not 1. ID is ' + accountResult);
            process.exit(1);
        }

        const tokenQuery = 'INSERT INTO account_token (uuid,account_id,remote_address) VALUES (?,?,?)';
        const tokenParams = [uuid, id, '::1'];
        const tokenFormatted = formatter.format(tokenQuery, tokenParams);

        const tokenResult = await pool.query(tokenFormatted);

        if (tokenResult[0].affectedRows !== 1) {
            console.error('ERROR', 'token was not inserted');
            process.exit(1);
        }

        console.log(
            'Created Administrator account with',
            '\nemail: ' + email,
            '\npassword: ' + nconf.get('admin:password'),
            '\nrefreshToken:\n' + refreshToken,
        );

        process.exit(0);
    } catch(e) {
        console.log(e);
        process.exit(1);
    }
}

void install();
