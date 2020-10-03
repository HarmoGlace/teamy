const { defineUnlistedProperty } = require('./Util');

/**
 * A DataFormatter. Used to format a data given by the library
 */

class DataFormatter {

    /**
     * Instantiates this DataFormatter
     * @param {TeamsManager} manager The TeamsManager that will be used to format the data
     * @param {Object} options The options of this DataFormatter
     * @param options.value The value of the data to format
     */

    constructor (manager, { value, ...othersArgs } = {}) {
        this.raw = value;

        this.data = { ...othersArgs };

        defineUnlistedProperty('manager', manager, this);
    }

    /**
     * Get the formatted data
     * @returns {*|Promise<*>}
     */

    get formatted () {
        return this.format();
    }

    /**
     * Formats the data belonging to this DataFormatter
     * @param [options] The others options that will be sent to the {@link TeamsManager.functions.formatPoints}
     * @returns {*|Promise<*>}
     */

    format (...options) {
        const method = this.manager.functions.formatPoints;
        return method ? method({ value: this.raw, ...this.data }, ...options) : this.raw;
    }

    /**
     * Convert this to a strict Boolean. See [mdn Boolean function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
     * @returns {boolean}
     */

    toBoolean () {
        return Boolean(this.raw);
    }

    /**
     * Convert the value stored to a boolean by checking if it is a truthy value. See [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT)
     * @returns {boolean}
     */

    toTruthy () {
        return !!this.raw;
    }
}

module.exports = DataFormatter;