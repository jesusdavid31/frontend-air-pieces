/* eslint-disable no-param-reassign */
const detectChanges = (original, copy) => {

    return Object.keys(original).reduce((updatedObject, key) => {
        if (original[key] !== copy[key]) {
            updatedObject[key] = copy[key];
        }
        return updatedObject;
    }, {});

}

export default detectChanges;