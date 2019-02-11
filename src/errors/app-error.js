'use strict';

class AppError extends Error {
    constructor(status, title, details) {
        super();

        this.name = this.constructor.name;
        this.status = status || 500;
        this.title = title || "Error";
        this.details = details || "The server encountered an error";

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(details)).stack;
        }
    }
}

module.exports = AppError;
