'use strict';

const util = require('util');
const fs = require('fs');
const readDir = util.promisify(fs.readdir);
const path = require('path');
const express = require('express');

const logger = require('../logger/winston');

const initFile = async (app, root, fileName) => {
    logger.debug(`[ROUTES] router path /${fileName}`);

    const router = express.Router();
    require(path.join(root, fileName))(router);

    app.use(`/${fileName}`, router);
};

const initFolder = async (app, root, folderName) => {
    const files = await readDir(path.join(root, folderName));

    for (let i in files) {
        const file = path.parse(files[i]);

        if (file.ext === '.js') {
            await initFile(app, root, path.join(folderName, file.name));
        }
    }
};

const init = async (app) => {
    logger.debug('[ROUTES] init');

    const root = `${process.env.NODE_PATH}/src/routes`;
    const files = await readDir(root);

    for (let i in files) {
        const file = path.parse(files[i]);

        if (!file.ext) {
            await initFolder(app, root, file.name);
        } else if (file.ext === '.js') {
            await initFile(app, root, file.name);
        }
    }

    logger.info('[ROUTES] init success');
};

module.exports = {
    init,
};
