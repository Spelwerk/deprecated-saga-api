const compareArray = (a, b) => {
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
};

const compareObjectKey = (a, b, key) => {
    if (a[key] < b[key])
        return -1;
    if (a[key] > b[key])
        return 1;
    return 0;
};

module.exports = {
    compareArray,
    compareObjectKey,
};
