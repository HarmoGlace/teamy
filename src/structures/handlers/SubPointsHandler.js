const PointsHandler = require('./PointsHandler');
const TeamyError = require("../TeamyError");

/**
 * Points Handler for Sub Teams
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
     * @returns {Number}
     */

    async parent () {
        return this.team.parent.points.get()
    }

    /**
     * Get the points of this team
     * @returns {Number}
     */

    async current () {
        return super.get();
    }

    /**
     * Get the points of this team
     * @returns {Number}
     */

    async get () {
        return this.current();
    }

    /**
     * Add points to this team
     * @param {Number} points Points to add
     * @returns {Number} newPoints New points of the team
     */

    async add (points) {
        await this.team.parent.points.add(points);

        await this.setLocal(await this.current() + points);

        return this.current();
    }

    /**
     * Remove points to this team
     * @param {Number} points Points to remove
     * @returns {Number} points New points of the team
     */

    async remove (points) {
        this.team.parent.points.remove(points);

        await this.setLocal(this.points.current() - points);

        return this.current();
    }

    /**
     * Set points of this team
     * @param {Number} points Points to set
     * @returns {Number} newPoints New Points of the team
     */

    async set (points) {
        const diff = points - await this.points.current();

        await this.team.parent.points.add(diff);

        this.team.manager.functions.setPoints(this.team, points);

        await this.get();
    }

    /**
     * Set points of this team only without editing parent team points. Use this carefully
     * @param {Number} points Points to set
     * @returns {*}
     */

    async setLocal (points) {

        if (isNaN(points)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

        return this.team.manager.functions.setPoints(this.team, points);
    }


}

module.exports = SubPointsHandler;