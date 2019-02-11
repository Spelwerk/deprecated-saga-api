const crypto = require('crypto');
const UUIDv4 = require('uuid/v4');

const hex = (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0, length);
};

const uniqueHex = () => {
    return `${hex(24)}-${hex(8)}-${hex(8)}-${hex(24)}`;
};

const uuid = () => {
    return UUIDv4();
};

module.exports = {
    hex,
    uniqueHex,
    uuid,
};
