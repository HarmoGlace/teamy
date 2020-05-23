/**
 * Points Handler
 */

class PointsHandler {

    /**
     * @param {Team} team Team this Handler belong to
     */

    constructor(team) {

        /**
         * Team this PointsHandler belong to
         * @type {Team}
         */

        this.team = team;
    }

    /**
     * Get the points of this team
     * @returns {number}
     */

    get () {
        return this.team.manager.functions.getPoints(this) || 0;
    }

    /**
     * Add points to the team
     * @param {number} points Points to add
     * @returns {*}
     */

    add (points) {
        return this.set(this.points.get() + points);
    }

    /**
     * Remove points to the team
     * @param {number} points Points to remove
     * @returns {*}
     */

    remove (points) {
        return this.set(this.points.get() - points);
    }

    /**
     * Set points to this team
     * @param {Number} points Points to set
     * @returns {*}
     */

    set (points) {
        if (isNaN(points)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`)
        return this.team.manager.functions.setPoints(this, points);
    }
}

module.exports = PointsHandler;