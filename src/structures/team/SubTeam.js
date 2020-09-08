const Team = require('./Team');
const TeamyError = require('../TeamyError');
const SubPointsHandler = require('../handlers/SubPointsHandler');

/**
 * A SubTeam
 * @extends Team
 */

class SubTeam extends Team {

    /**
     *
     * @param {TeamsManager} manager TeamsManager this SubTeam belong to
     * @param {TeamData} data Data for this SubTeam
     * @param {ParentTeam} parent Parent team of this SubTeam
     */

    constructor (manager, data, parent) {
        super(manager, data);

        /**
         * The type of this team
         * @type {TeamType}
         */

        this.type = 'sub';

        /**
         * ParentTeam of this team
         * @type {ParentTeam}
         */

        this.parent = parent;

        /**
         * Points Handler of this team
         * @type {SubPointsHandler}
         */

        this.points = new SubPointsHandler(this);
    }
}

module.exports = SubTeam;