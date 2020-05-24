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
     * @returns {Number} New team points
     */

    add (points) {
        this.set(this.get() + points);

        return this.get();
    }

    /**
     * Remove points to the team
     * @param {number} points Points to remove
     * @returns {Number} New team points
     */

    remove (points) {
        this.set(this.get() - points);

        return this.get();
    }

    /**
     * Set points to this team
     * @param {Number} points Points to set
     * @returns {Number} New team points
     */

    set (points) {
        if (isNaN(points)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

        this.team.manager.functions.setPoints(this, points);

        return this.get();
    }

    /**
      *  Clear (reset) the points of this team. Use this carefully
      * @returns {Number} New points of the team (0)
     */

    clear () {
        this.set(0);

        return this.get();
    }
}

module.exports = PointsHandler;