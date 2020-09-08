const Team = require('./Team');

/**
 * A Parent Team
 * @extends Team
 */

class ParentTeam extends Team {

    /**
     *
     * @param {TeamsManager} manager TeamsManager this ParentTeam belong to
     * @param {TeamData} data The data for this team
     */

    constructor (manager, data) {
        super(manager, data);

        /**
         * The type of this team
         * @type {TeamType}
         */

        this.type = 'parent';


        /**
         * The list of all sub teams of this team
         * @type {SubTeam[]}
         */

        this.subs = [];
    }
}

module.exports = ParentTeam;