const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);
const path = require('path');

const saveTextToFile = async (text, file) => {
    if (process.env.NODE_ENV === 'production') return;

    const directory = `${process.env.NODE_PATH}/tests/`;
    await writeFile(path.join(directory, file), text, 'utf8');

    console.log('saved text:', text, 'to file:', file);
};

const saveHashToTestFile = async (hash) => {
    await saveTextToFile(hash, 'secret');
};

module.exports = {
    saveTextToFile,
    saveHashToTestFile,
};
