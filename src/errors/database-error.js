'use strict';

let AppError = require('./app-error');

class DatabaseError extends AppError {
    constructor(err, sql) {
        super(500, "Database Error", "An error has occured in the database", err.sqlMessage);

        this.details = err.sqlMessage;
        this.sql = sql;
        this.code = err.code;
        this.number = err.errno;
        this.state = err.sqlState;
    }
}

module.exports = DatabaseError;
