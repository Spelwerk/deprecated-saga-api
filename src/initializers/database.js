'use strict';

const nconf = require('nconf');
const mysql = require('mysql2/promise');

const logger = require('../logger/winston');
const { FieldTitle } = require('../constants');

const restrictedFields = [
    'id',
    'account_id',
    'password',
    'canon',
    'is_template',
    'created',
    'deleted',
    'updated',
];

let pool;
let dbArray = [];
let dbSchema = {};

const DatabaseSchemaNotFoundError = require('../errors/database-schema-not-found');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const bootstrapTableSchema = () => {
    return {
        topTable: false,

        // Table changes is restricted to admin or requires a logged in account
        security: {
            admin: false,
            account: false,
        },

        // The table supports the following extra relations
        supports: {
            comments: false,
            copies: false,
            images: false,
            labels: false,
        },

        // Fields
        fields: {
            // The table has the following special fields
            canon: false,
            updated: false,
            deleted: false,

            // List of all fields
            all: [],

            // List of all fields that are allowed to be changed
            accepted: [],

            // List of all fields that do not have _id in the name
            nonId: [],

            // List of options for all accepted fields
            options: {},

            // Extra Fields in extraData
            extra: {},
        },

        // Relational Tables
        tables: {
            hasMany: [],
            isOne: [],
            extraData: [],
        },
    };
};

const getColumnInformation = async (tableName) => {
    logger.debug(`[DATABASE] getColumnInformation(${tableName})`);

    let object = {};

    const query = "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH FROM information_schema.columns WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?";
    const params = [tableName, nconf.get('database:database')];

    const [rows] = await pool.execute(query, params);

    for (let i in rows) {
        const row = rows[i];

        const name = row['COLUMN_NAME'];
        const type = row['DATA_TYPE'];
        const length = row['CHARACTER_MAXIMUM_LENGTH'];
        const mandatory = row['IS_NULLABLE'] === 'NO';

        if (Object.keys(FieldTitle).indexOf(name) === -1 && restrictedFields.indexOf(name) === -1) {
            throw new Error(`The field name: {{ ${name} }} could not be found in the FieldTitle dictionary. You need to add it before init can be completed. Found this in the table: ${tableName}`);
        }

        object[name] = {
            title: FieldTitle[name],
            type: type,
            mandatory: mandatory,
            maximum: length,
        };
    }

    logger.debug(`[DATABASE] getColumnInformation(${tableName}) success`);

    return object;
};

const setDatabaseArray = async () => {
    logger.debug(`[DATABASE] setDatabaseArray`);

    const query = "SELECT TABLE_NAME FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = ?";
    const params = [nconf.get('database:database')];

    let [rows] = await pool.execute(query, params);

    for (let i in rows) {
        dbArray.push(rows[i]['TABLE_NAME']);
    }

    logger.debug(`[DATABASE] setDatabaseArray success`);
};

const setDatabaseSchema = async () => {
    logger.debug(`[DATABASE] setDatabaseSchema`);

    for (let i in dbArray) {
        const tableName = dbArray[i];

        await setTableSchema(tableName);
    }

    for (let i in dbArray) {
        let tableName = dbArray[i];

        setTableSchemaExtraFields(tableName);
    }
    logger.debug(`[DATABASE] setDatabaseSchema success`);
};

const setTableSchema = async (tableName) => {
    logger.debug(`[DATABASE] setTableSchema(${tableName})`);

    // Bootstrap
    dbSchema[tableName] = bootstrapTableSchema();

    // Top Table
    if (tableName.indexOf('_') === -1) dbSchema[tableName].topTable = true;

    // General Schema
    void await setTableSchemaGeneral(tableName);

    // Relations Schema
    setTableSchemaRelations(tableName);

    // Admin Restriction
    dbSchema[tableName].security.admin = !dbSchema[tableName].security.account;

    logger.debug(`[DATABASE] setTableSchema(${tableName}) success`);
};

const setTableSchemaGeneral = async (tableName) => {
    logger.debug(`[DATABASE] setTableSchemaGeneral(${tableName})`);

    const object = await getColumnInformation(tableName);

    for (let key in object) {
        const name = key;
        const options = object[key];

        dbSchema[tableName].fields.all.push(name);

        if (name === 'canon') dbSchema[tableName].fields.canon = true;
        if (name === 'updated') dbSchema[tableName].fields.updated = true;
        if (name === 'deleted') dbSchema[tableName].fields.deleted = true;

        if (restrictedFields.indexOf(name) === -1) {
            dbSchema[tableName].fields.accepted.push(name);
            dbSchema[tableName].fields.options[name] = options;
        }

        if (name.indexOf('_id') === -1) {
            dbSchema[tableName].fields.nonId.push(name);
        }
    }

    logger.debug(`[DATABASE] setTableSchemaGeneral(${tableName}) success`);
};

const setTableSchemaRelations = (tableName) => {
    logger.debug(`[DATABASE] setTableSchemaRelations(${tableName})`);

    for (let i in dbArray) {
        let compareName = dbArray[i];

        if (compareName === tableName) continue;
        if (compareName.indexOf(tableName) === -1) continue;

        // Setting Account Security
        if (compareName === 'account_has_' + tableName) {
            dbSchema[tableName].security.account = true;
        }

        // Setting "many to many" relations
        if (compareName.indexOf(tableName + '_has_') !== -1) {
            let pushName = compareName.split('_has_')[1];

            if (pushName === 'comment') {
                dbSchema[tableName].supports.comments = true;
            }

            if (pushName === 'image') {
                dbSchema[tableName].supports.images = true;
            }

            if (pushName === 'label') {
                dbSchema[tableName].supports.labels = true;
            }

            if (['comment', 'image', 'label'].indexOf(pushName) === -1) {
                dbSchema[tableName].tables.hasMany.push(pushName);
            }
        }

        // Setting "one to one" relations
        if (compareName.indexOf(tableName + '_is_') !== -1) {
            let pushName = compareName.split('_is_')[1];

            if (pushName === 'copy') {
                dbSchema[tableName].supports.copies = true;
            }

            if (pushName !== 'copy') {
                dbSchema[tableName].tables.isOne.push(pushName);
            }
        }

        // Setting "with data" relations
        if (compareName.indexOf(tableName + '_with_') !== -1) {
            let pushName = compareName.split('_with_')[1];

            dbSchema[tableName].tables.extraData.push(pushName);
        }
    }

    logger.debug(`[DATABASE] setTableSchemaRelations(${tableName}) success`);
};

const setTableSchemaExtraFields = (tableName) => {
    logger.debug(`[DATABASE] setTableSchemaExtraFields(${tableName})`);

    let array = dbSchema[tableName].tables.extraData;

    for (let i in array) {
        let extraName = array[i];
        let table_with_extra = tableName + '_with_' + extraName;
        let extraArray = dbSchema[table_with_extra].fields.accepted;

        dbSchema[tableName].fields.extra[extraName] = [];

        for (let i in extraArray) {
            if (extraArray[i] === tableName + '_id') continue;

            dbSchema[tableName].fields.extra[extraName].push(extraArray[i]);
        }
    }

    logger.debug(`[DATABASE] setTableSchemaExtraFields(${tableName}) success`);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const init = async () => {
    logger.debug(`[DATABASE] init`);

    pool = mysql.createPool(nconf.get('database'));

    await setDatabaseArray();
    await setDatabaseSchema();

    //console.log(dbSchema['creature'].fields);

    logger.info('[DATABASE] init success');
};

function getPool() {
    logger.debug('getPool');
    return pool;
}

function getSchema(tableName) {
    if (tableName) {
        const schema = dbSchema[tableName];

        if (!schema) {
            throw new DatabaseSchemaNotFoundError(tableName);
        }

        return schema;
    }
    return dbSchema;
}

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    init,
    getPool,
    getSchema,
};
