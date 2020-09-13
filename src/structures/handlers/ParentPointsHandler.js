const PointsHandler = require('./PointsHandler');

/**
 * Parent points handler
 */

class ParentPointsHandler extends PointsHandler {

    /**
     * @extends PointsHandler
     * @param {ParentTeam} team ParentTeam this points belong to
     */

    constructor (team) {
        super(team);
    }

    /**
     * Clear (reset) the points of this team. Use this carefully
     * @param [resursive=true] Whatever to also clear points of sub teams
     * @returns {Number} New team points (should be 0)
     */

    clear (resursive = true) {
        super.clear();

        if (resursive) {
            for (const sub of this.subs) {
                sub.points.clear();
            }
        }
    }

}