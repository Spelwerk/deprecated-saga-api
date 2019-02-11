'use strict';

// ////////////////////////////////////////////////////////////////////////////////// //
// PRIVATE
// ////////////////////////////////////////////////////////////////////////////////// //

const splitUnderscore = (object, name) => {
    let result = {};

    for (let key in object) {
        if (!object.hasOwnProperty(key)) continue;

        const split = key.split('__');
        const splitCompare = split[0];
        const splitKey = split[1];
        
        if (splitCompare.indexOf(name) === -1) continue;

        result[splitKey] = object[key];
    }

    return result;
};

// ////////////////////////////////////////////////////////////////////////////////// //
// PUBLIC
// ////////////////////////////////////////////////////////////////////////////////// //

const splitObject = (object) => {
    let result = {};

    for (let key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if (key.indexOf('__') !== -1) {
            const name = key.split('__')[0];
            result[name] = splitUnderscore(object, name);
        } else {
            result[key] = object[key];
        }
    }

    return result;
};

// ////////////////////////////////////////////////////////////////////////////////// //
// EXPORTS
// ////////////////////////////////////////////////////////////////////////////////// //

module.exports = {
    splitObject,
};
