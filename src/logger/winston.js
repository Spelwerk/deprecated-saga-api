const winston = require('winston');

const PATH = process.env.NODE_PATH;

const logger = winston.createLogger({
    format: winston.format.json(),
    maxsize: 5242880,
    maxFiles: 20,
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: `${PATH}/logs/error.log`,
        }),
        new winston.transports.File({
            level: 'warn',
            filename: `${PATH}/logs/warn.log`,
        }),
        new winston.transports.File({
            level: 'info',
            filename: `${PATH}/logs/info.log`,
        }),
        new winston.transports.File({
            level: 'debug',
            filename: `${PATH}/logs/debug.log`,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: `${PATH}/logs/exceptions.log`,
        }),
    ]
});

if (process.env.NODE_ENV !== 'production') {
    const level = process.env.NODE_CONSOLE_LEVEL || 'info';

    logger.add(new winston.transports.Console({
        level: level,
        handleExceptions: true,
        colorize: true,
        json: false,
        format: winston.format.simple(),
    }));
}

logger.info('[LOGGER] init success');

module.exports = logger;
