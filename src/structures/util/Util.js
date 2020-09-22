class Util {

    constructor () {

    }

    static defineUnlistedProperty (name, value, object) {
        return Object.defineProperty(object, name, {
            value,
            configurable: true,
            enumerable: false,
            writable: true
        });
    }
}

module.exports = Util;