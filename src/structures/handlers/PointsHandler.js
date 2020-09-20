const TeamyError = require("../TeamyError");

/**
 * Points Handler
 */

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
     * @param Booolean [nullable=false] Whatever to return null if the provided function returns a falsy value
     * @returns {number}
     */

    async get (nullable = false) {
        let found = Number(await this.team.manager.functions.getPoints(this.team));

        if (!found && found !== 0) found = nullable ? null : 0;

        if (Number.isNaN(found) && found !== null) throw new TeamyError(`getPoints function should only return number. Received ${found.constructor.name}`);

        this.latest = found;

        return found;
    }

    /**
     * Add points to the team
     * @param {number} points Points to add
     * @returns {Number} New team points
     */

    async add (points) {
        return this.set(await this.get() + points);
    }

    /**
     * Remove points to the team
     * @param {number} points Points to remove
     * @returns {Number} New team points
     */

    async remove (points) {
        return this.set(await this.get() - points);
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
        const returned = await this.get(true);
        if (!returned && returned !== 0) await this.set(0);
        return returnTeam ? this.team : this;
    }

    /**
     *  Clear (reset) the points of this team. Use this carefully
     * @returns {Number} New team points (should be 0)
     */

    async clear () {
        return this.set(0);
    }
}

module.exports = PointsHandler;