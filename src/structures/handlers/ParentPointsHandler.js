const PointsHandler = require('./PointsHandler');

/**
 * ParentPointsHandler, for {@link ParentTeam}. Extends {@link PointsHandler}
 * @extends PointsHandler
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
     * @returns {Promise<Number>} New team points (should be 0)
     */

    async clear (resursive = true) {
        super.clear();

        if (resursive) {
            for (const sub of this.subs) {
                sub.points.clear();
            }
        }

        return true;
    }

}

module.exports = ParentPointsHandler;