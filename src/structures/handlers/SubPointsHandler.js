const PointsHandler = require('./PointsHandler');
const TeamyError = require("../TeamyError");

/**
 * SubPointsHandler, for {@link SubTeam}. Extends {@link PointsHandler}
 * @extends PointsHandler
 */

class SubPointsHandler extends PointsHandler {

    /**
     * @param {SubTeam} team SubTeam this Handler belong to
     */

    constructor (team) {

        super(team);

    }

    /**
     * Get the points of the parent team
     * @returns {Promise<Number>}
     */

    parent (...args) {
        return this.team.parent.points.get(...args);
    }

    /**
     * Get the points of this team
     * @returns {Promise<Number>}
     */

    current (...args) {
        return super.get(...args);
    }

    /**
     * Get the points of this team
     * @returns {Promise<Number>}
     */

    get (...args) {
        return this.current(...args);
    }

    /**
     * Add points to this team
     * @param {Number} points Points to add
     * @param othersArgs Others Args that will be passed to the setPoints function
     * @returns {Promise<Number>} newPoints New points of the team
     */

    async add (points, ...othersArgs) {
        await this.team.parent.points.add(points);

        await this.setLocal(await this.current(null, true) + points, ...othersArgs);

        return this.current();
    }

    /**
     * Remove points to this team
     * @param {Number} points Points to remove
     * @param othersArgs Others Args that will be passed to the setPoints function
     * @returns {Promise<Number>} points New points of the team
     */

    async remove (points, ...othersArgs) {
        return this.add(-points, ...othersArgs);
    }

    /**
     * Clears the points of this SubTeam
     * @param [locally=false] Whatever to only clear points of this SubTeam without removing them from the ParentTeam. Could cause incorrect data
     * @param othersArgs othersArgs that will be passed to the setPoints function
     * @returns {Promise<Number>}
     */

    clear (locally = false, ...othersArgs) {
        return (locally ? this.setLocal : this.set).bind(this)(0, ...othersArgs);
    }

    /**
     * Set points of this team
     * @param {Number} points Points to set
     * @param othersArgs Others Args that will be passed to the setPoints function
     * @returns {Promise<Number>} newPoints New Points of the team
     */

    async set (points, ...othersArgs) {
        const diff = points - await this.current(null, true);

        await this.team.parent.points.add(diff);

        await this.team.manager.functions.setPoints(this.team, points, ...othersArgs);

        return this.get(...othersArgs);
    }

    /**
     * Set points of this team only without editing parent team points. Use this carefully
     * @param {Number} points Points to set
     * @param othersArgs othersArgs that will be passed to the setPoints function
     * @returns {*}
     */

    async setLocal (points, ...othersArgs) {

        const number = Number(points);

        if (Number.isNaN(number)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

        return this.team.manager.functions.setPoints(this.team, number, ...othersArgs);
    }


}

module.exports = SubPointsHandler;