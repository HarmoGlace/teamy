const PointsHandler = require('./PointsHandler');

/**
 * Parent points handler
 */

class ParentPointsHandler extends PointsHandler {

    /**
     * @extends PointsHandler
     * @param {ParentTeam} team ParentTeam this points belong to
     */

    constructor(team) {
        super(team);
    }

    /**
     * Clear (reset) the points of this team. Use this carefully
     * @returns {Number} points New points of the team (0)
     */

    clear () {
        this.set(0);

        return this.get();
    }

}