/**
 * Points Handler
 */

const TeamyError = require("../TeamyError");

class PointsHandler {

    /**
     * @param {Team} team Team this Handler belong to
     */

    constructor (team) {

        /**
         * Team this PointsHandler belong to
         * @type {Team}
         */

        this.team = team;


        /**
         * Latest points recorded
         * @type {Number}
         */

        this.latest = null;
    }

    /**
     * Get the points of this team
     * @returns {number}
     */

    async get () {
        const found = (await this.team.manager.functions.getPoints(this.team)) || 0;

        this.latest = found;

        return found;
    }

    /**
     * Add points to the team
     * @param {number} points Points to add
     * @returns {Number} New team points
     */

    async add (points) {
        await this.set(await this.get() + points);

        return this.get();
    }

    /**
     * Remove points to the team
     * @param {number} points Points to remove
     * @returns {Number} New team points
     */

    async remove (points) {
        await this.set(await this.get() - points);

        return this.get();
    }

    /**
     * Set points to this team
     * @param {Number} points Points to set
     * @returns {Number} New team points
     */

    async set (points) {
        if (isNaN(points)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

        await this.team.manager.functions.setPoints(this.team, points);

        return this.get();
    }

    /**
     *
     * @param {Boolean} [returnTeam=false] Whatever or not to return the current team instead of these points
     * @return {Promise<PointsHandler>}
     */

    async checkPoints (returnTeam = false) {
        await this.get();
        return returnTeam ? this.team : this;
    }

    /**
     *  Clear (reset) the points of this team. Use this carefully
     * @returns {Number} New team points (should be 0)
     */

    async clear () {
        await this.set(0);

        return this.get();
    }
}

module.exports = PointsHandler;