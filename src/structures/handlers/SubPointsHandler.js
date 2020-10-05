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
     * @returns {number|Promise<Number>}
     */

    parent (...args) {
        return this.team.parent.points.get(...args);
    }

    /**
     * Get the points of this team
     * @returns {number|Promise<Number>}
     */

    current (...args) {
        return super.get(...args);
    }

    /**
     * Get the points of this team
     * @returns {number|Promise<Number>}
     */

    get (...args) {
        return this.current(...args);
    }

    /**
     * Add points to this team
     * @param {Number} points Points to add
     * @returns {number|Promise<Number>} newPoints New points of the team
     */

    async add (points) {
        const added = this.team.parent.points.add(points);

        // if (added instanceof Promise) {
        //     return new Promise(((resolve, reject) => {
        //         added.then(() => {
        //             this.setLocal()
        //         })
        //     }))
        // }

        await this.setLocal(await this.current(null, true) + points);

        return this.current();
    }

    /**
     * Remove points to this team
     * @param {Number} points Points to remove
     * @returns {Promise<Number>} points New points of the team
     */

    async remove (points) {
        return this.add(-points);
    }

    /**
     * Clears the points of this SubTeam
     * @param [locally=false] Whatever to only clear points of this SubTeam without removing them from the ParentTeam. Could cause incorrect data
     * @returns {Promise<Number>}
     */

    async clear (locally = false) {
        return (locally ? this.setLocal : this.set).bind(this)(0);
    }

    /**
     * Set points of this team
     * @param {Number} points Points to set
     * @returns {Promise<Number>} newPoints New Points of the team
     */

    async set (points, ...othersArgs) {
        const diff = points - await this.current(null, true);

        await this.team.parent.points.add(diff);

        await this.team.manager.functions.setPoints(this.team, points);

        return this.get(...othersArgs);
    }

    /**
     * Set points of this team only without editing parent team points. Use this carefully
     * @param {Number} points Points to set
     * @returns {*}
     */

    async setLocal (points) {

        const number = Number(points);

        if (Number.isNaN(number)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

        return this.team.manager.functions.setPoints(this.team, number);
    }


}

module.exports = SubPointsHandler;