'use strict';

const _ = require('lodash');
const logger = require('../../logger/winston');
const mysql = require('mysql2');
const { getPool, getSchema } = require('../../initializers/database');
const { splitObject } = require('../../utils/data-splitter');
const { validator } = require('../../utils');

const pool = getPool();

const AppError = require('../../errors/app-error');
const DatabaseError = require('../../errors/database-error');
const DatabaseDuplicateEntryError = require('../../errors/database-duplicate-entry-error');

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const isValueEmpty = (value) => {
    return value === null || value === '' || value === 'undefined';
};

const isKeyInArray = (key, array) => {
    return array.indexOf(key) !== -1;
};

const isKeyInSchema = (key, schema) => {
    return isKeyInArray(key, schema.fields.all);
};

const snakeCaseKeys = (input) => {
    let result = {};

    _.forEach(input, (value, key) => {
        const snake = _.snakeCase(key);
        result[snake] = value;
    });

    return result;
};

const formatRows = (rows, fields) => {
    logger.debug('common-sql-helper.formatRows');

    if (!rows || !rows.length || !fields) {
        return [];
    }

    for (let i in rows) {
        if (!rows.hasOwnProperty(i)) continue;

        let row = rows[i];

        for (let key in row) {
            if (!row.hasOwnProperty(key)) continue;

            for (let x in fields) {
                if (!fields.hasOwnProperty(x)) continue;

                const field = fields[x];

                if (field.name === key && field.columnType === 1) {
                    row[key] = row[key] === 1;
                }
            }

            if (row[key] === '') {
                row[key] = null;
            }
        }

        rows[i] = splitObject(rows[i]);
    }

    return rows;
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const SQL = async (query, params) => {
    try {
        if (Array.isArray(params)) {
            query = mysql.format(query, params);
        }

        console.log(query);

        let data = [];
        let result = await pool.query(query);

        if (query.indexOf('SELECT') !== -1) {
            const rows = result[0];
            const fields = result[1];

            data = formatRows(rows, fields);
        } else if (query.indexOf('INSERT') !== -1) {
            const insert = result[0];

            data = insert.insertId;
        }

        return data;
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            throw new DatabaseDuplicateEntryError(e, query);
        } else {
            throw new DatabaseError(e, query);
        }
    }
};

const SELECT = async (table, what, where, options) => {
    logger.debug('common-sql-helper.SELECT');

    validator([
        { expect: 'string', params: { table }},
        { expect: 'array', params: { what }},
    ]);

    const schema = getSchema(table);

    let query = 'SELECT ';
    let array = [];

    if (what[0] === '*') {
        query += '*, ';
    } else {
        _.forEach(what, (item) => {
            if (!isKeyInSchema(item, schema)) return;
            query += item + ', ';
        });
    }

    query = query.slice(0, -2) + ` FROM ${table}`;

    if (where) {
        where = snakeCaseKeys(where);

        query = query + ' WHERE ';

        _.forEach(where, (value, key) => {
            if (!isKeyInSchema(key, schema)) return;
            if (isValueEmpty(value)) return;

            if (value === 'NULL') {
                query += `${key} IS NULL AND `;
            } else {
                query += `${key} = ? AND `;
                array.push(value);
            }
        });

        query = query.slice(0, -5);
    }

    if (options && options.sort) {
        query += ' ORDER BY ';

        _.forEach(options.sort, (v, key) => {
            query += `${key} ${options.sort[key]}, `;
        });

        query = query.slice(0, -2);
    }

    if (options && options.limit && options.limit !== null && options.limit !== '') {
        query += ' LIMIT ' + options.limit;
    }

    if (options && options.offset && options.offset !== null && options.offset !== '') {
        query += ' OFFSET ' + options.offset;
    }

    return await SQL(query, array);
};

const COUNT = async (table, where) => {
    logger.debug('common-sql-helper.COUNT');

    validator([
        { expect: 'string', params: { table }},
    ]);

    const schema = getSchema(table);

    let query = `SELECT COUNT(*) FROM ${table}`;
    let array = [];

    if (where) {
        where = snakeCaseKeys(where);

        query = query + ' WHERE ';

        _.forEach(where, (value, key) => {
            if (!isKeyInSchema(key, schema)) return;
            if (isValueEmpty(value)) return;

            if (value === 'NULL') {
                query += `${key} IS NULL AND `;
            } else {
                query += `${key} = ? AND `;
                array.push(value);
            }
        });

        query = query.slice(0, -5);
    }

    return await SQL(query, array);
};

const INSERT = async (table, payload, duplicates) => {
    logger.debug('common-sql-helper.INSERT');

    validator([
        { expect: 'string', params: { table }},
        { expect: 'object', params: { payload }},
    ]);

    payload = snakeCaseKeys(payload);

    const schema = getSchema(table);

    let query = `INSERT INTO ${table} (`;
    let values = ' VALUES (';
    let array = [];

    _.forEach(payload, (value, key) => {
        if (!isKeyInSchema(key, schema)) return;
        if (isValueEmpty(value)) return;

        query += `${key}, `;
        values += '?, ';
        array.push(value);
    });

    if (!array.length) {
        return null;
    }

    query = query.slice(0, -2) + ')';
    values = values.slice(0, -2) + ')';
    query += values;

    if (duplicates) {
        duplicates = snakeCaseKeys(duplicates);

        query += ' ON DUPLICATE KEY UPDATE ';

        _.forEach(duplicates, (value, key) => {
            if (!isKeyInSchema(key, schema)) return;
            if (isValueEmpty(value)) return;

            query += `${key} = VALUES(${key}), `;
        });

        query = query.slice(0, -2);
    }

    return await SQL(query, array);
};

const UPDATE = async (table, payload, where) => {
    logger.debug('common-sql-helper.UPDATE');

    validator([
        { expect: 'string', params: { table }},
        { expect: 'object', params: { payload, where }},
    ]);

    payload = snakeCaseKeys(payload);
    where = snakeCaseKeys(where);

    const schema = getSchema(table);

    let query = `UPDATE ${table} SET `;
    let array = [];
    let whereExists;

    _.forEach(payload, (value, key) => {
        if (!isKeyInSchema(key, schema)) return;
        if (isValueEmpty(value)) return;

        query += `${key} = ?, `;
        array.push(value);
    });

    if (schema.fields.updated) {
        query += 'updated = CURRENT_TIMESTAMP, ';
    }

    query = query.slice(0, -2) + ' WHERE ';

    _.forEach(where, (value, key) => {
        if (!isKeyInSchema(key, schema)) return;
        if (isValueEmpty(value)) return;

        query += key + ' = ? AND ';
        array.push(value);
        whereExists = true;
    });

    if (!array || !array.length) {
        throw new AppError(500, 'Error on update', 'Could not find anything to update');
    }

    if (!whereExists) {
        throw new AppError(500, 'Error on update', 'Could not find a unique key to process update');
    }

    query = query.slice(0, -5);

    return await SQL(query, array);
};

const HIDE = async (table, where) => {
    logger.debug('common-sql-helper.HIDE');

    validator([
        { expect: 'string', params: { table }},
        { expect: 'object', params: { where }},
    ]);

    where = snakeCaseKeys(where);

    const schema = getSchema(table);

    if (!schema.fields.deleted) {
        throw new AppError(500, 'Deletion failure', 'Trying to delete this row is impossible', 'The API is trying to call a function for a table which does not have the correct fields');
    }

    let query = `UPDATE ${table} SET updated = CURRENT_TIMESTAMP, deleted = 1 WHERE `;
    let array = [];
    let whereExists;

    _.forEach(where, (value, key) => {
        if (!isKeyInSchema(key, schema)) return;
        if (isValueEmpty(value)) return;

        query += `${key} = ? AND `;
        array.push(value);
        whereExists = true;
    });

    if (!array || !array.length) {
        throw new AppError(500, 'Error on hide', 'Could not find anything to hide');
    }

    if (!whereExists) {
        throw new AppError(500, 'Error on hide', 'Could not find a unique key to process update');
    }

    query = query.slice(0, -5);

    return await SQL(query, array);
};

const DELETE = async (table, where) => {
    logger.debug('common-sql-helper.DELETE');

    validator([
        { expect: 'string', params: { table }},
        { expect: 'object', params: { where }},
    ]);

    where = snakeCaseKeys(where);

    const schema = getSchema(table);

    let query = `DELETE FROM ${table} WHERE `;
    let array = [];
    let whereExists;

    _.forEach(where, (value, key) => {
        if (!isKeyInSchema(key, schema)) return;
        if (isValueEmpty(value)) return;

        query += `${key} = ? AND `;
        array.push(value);
        whereExists = true;
    });

    if (!array || !array.length) {
        throw new AppError(500, 'Error on delete', 'Could not find anything to delete');
    }

    if (!whereExists) {
        throw new AppError(500, 'Error on delete', 'Could not find a unique key to process update');
    }

    query = query.slice(0, -5);

    return await SQL(query, array);
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    SQL,
    SELECT,
    COUNT,
    INSERT,
    UPDATE,
    HIDE,
    DELETE,
};
