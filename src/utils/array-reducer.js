const arrayReducer = (array) => {
    return array.reduce((flat, toFlatten) => {
        return flat.concat(Array.isArray(toFlatten) ? arrayReducer(toFlatten) : toFlatten);
    }, []);
};

module.exports = arrayReducer;
