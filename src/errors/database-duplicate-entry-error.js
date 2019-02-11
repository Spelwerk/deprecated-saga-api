'use strict';

let AppError = require('./app-error');

class DatabaseDuplicateEntryError extends AppError {
    constructor(err, sql) {
        const unique = err.message.indexOf("_UNIQUE") !== -1
            ? err.message.split("_UNIQUE")
            : null;

        const uniqueKey = unique !== null
            ? unique[0].split("for key \'")[1]
            : null;

        super(500, "Duplicate Error", "The item you tried to add already exists in the database.");

        this.uniqueKey = uniqueKey;
        this.details = err.message;
        this.sql = sql;
        this.code = err.code;
        this.number = err.errno;
        this.state = err.sqlState;
    }
}

module.exports = DatabaseDuplicateEntryError;
