const PointsHandler = require('./PointsHandler');

/**
 * Points Handler for Sub Teams
 * @extends PointsHandler
 */

class SubPointsHandler extends PointsHandler {

    /**
     * @param {SubTeam} team SubTeam this Handler belong to
     */

    constructor(team) {
        super(team);
    }

    /**
     * Get the points of the parent team
     * @returns {Number}
     */

    parent() {
        return this.team.parent.points.get() || 0
    }

    /**
     * Get the points of this team
     * @returns {Number}
     */

    current() {
        return this.team.manager.functions.getPoints(this) || 0
    }

    /**
     * Get the points of this team
     * @returns {Number}
     */

    get() {
        return this.current();
    }

    /**
     * Add points to this team
     * @param {Number} points Points to add
     */

    add(points) {
        this.parent.points.add(points);

        return this.points.setLocal(this.points.current() + points);
    }

    /**
     * Remove points to this team
     * @param {Number} points Points to remove
     */

    remove(points) {
        this.parent.points.remove(points);

        return this.points.setLocal(this.points.current() - points);
    }

    /**
     * Set points of this team
     * @param {Number} points Points to set
     * @returns {*}
     */

    set(points) {
        const diff = points - this.points.current();

        this.parent.points.add(diff);

        return manager.functions.setPoints(this, points);
    }

    /**
     * Set points of this team only without editing parent team points. Use this carefully
     * @param {Number} points Points to set
     * @returns {*}
     */

    setLocal(points) {

        if (isNaN(points)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

        return manager.functions.setPoints(this, points);
    }


}

module.exports = SubPointsHandler;