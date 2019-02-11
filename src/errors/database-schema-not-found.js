'use strict';

let AppError = require('./app-error');

class DatabaseSchemaNotFound extends AppError {
    constructor(table) {
        super(500, `Schema Not Found`, `The schema for table ${table} cannot be found`);
    }
}

module.exports = DatabaseSchemaNotFound;
