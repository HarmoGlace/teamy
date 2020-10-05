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
     * @param othersArgs Others Args that will be passed to the clear function
     * @returns {Promise<Number>} New team points (should be 0)
     */

    async clear (resursive = true, ...othersArgs) {
        super.clear(null, ...othersArgs);

        if (resursive) {
            for (const sub of this.subs) {
                sub.points.clear(null, ...othersArgs);
            }
        }

        return true;
    }

}

module.exports = ParentPointsHandler;