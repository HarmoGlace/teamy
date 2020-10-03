const { defineUnlistedProperty } = require('./Util');

class DataFormatter {
    constructor (manager, { value, ...othersArgs } = {}) {
        this.raw = value;

        this.data = { ...othersArgs };

        defineUnlistedProperty('manager', manager, this);
    }

    get formatted () {
        return this.format();
    }

    format (...options) {
        const method = this.manager.functions.formatPoints;
        return method ? method({ value: this.raw, ...this.data}, ...options) : this.raw;
    }

    toBoolean () {
        return Boolean(this.raw);
    }

    toTruthy () {
        return !!this.raw;
    }
}

module.exports = DataFormatter;