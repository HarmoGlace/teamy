const TeamyError = require("../TeamyError");
const { defineUnlistedProperty } = require('../util/Util');

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

        defineUnlistedProperty('team', team, this);


        /**
         * Latest points recorded. It is undefined if there is no points recorded and null if the latest points recorded are null
         * @type {Number|null|undefined}
         */

        this.latest = undefined;
    }

    /**
     * Get the points of this team
     * @param {Boolean} [nullable=false] Whatever to return null if the provided function returns a falsy value (excepted 0)
     * @returns {Promise<number|null>} The points of the team
     */

    async get (nullable = false) {
        let found = await this.team.manager.functions.getPoints(this.team);

        if (!found && found !== 0) found = nullable ? null : 0;

        if (found) found = Number(found);

        if (Number.isNaN(found) && found !== null) throw new TeamyError(`getPoints function should only return number. Received ${found.constructor.name}`);

        this.latest = found;

        return found;
    }

    /**
     * Add points to the team
     * @param {number} points Points to add
     * @returns {Promise<Number>} New team points
     */

    async add (points) {
        return this.set(await this.get() + points);
    }

    /**
     * Remove points to the team
     * @param {number} points Points to remove
     * @returns {Promise<Number>} New team points
     */

    async remove (points) {
        return this.add(-points);
    }

    /**
     * Set points to this team
     * @param {Number} points Points to set
     * @returns {Promise<Number>} New team points
     */

    async set (points) {
        if (isNaN(points)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

        await this.team.manager.functions.setPoints(this.team, points);

        return this.get();
    }

    /**
     * Check the points of the team to update the `latest` property
     * @return {Promise<PointsHandler>}
     */

    async checkPoints () {
        const returned = await this.get(true);
        if (!returned && returned !== 0) await this.set(0);
        return this;
    }

    /**
     *  Clear (reset) the points of this team. Use this carefully
     * @param [recursive=true] Whatever also delete points of members who belongs to this team, if there are.
     * @returns {Promise<Number>} New team points (should be 0)
     */

    async clear (recursive = true) {

        const set = this.set(0);

        if (!recursive || !this.members?.enabled) return set;

        const members = await this.members.fetch();

        for (const member of members.toArray()) {
            member.points.clear();
        }

        return set;
    }
}

module.exports = PointsHandler;