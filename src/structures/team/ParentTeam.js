const Team = require('./Team');
const TeamsHandler = require('../handlers/TeamsHandler');
const ParentPointsHandler = require('../handlers/ParentPointsHandler');

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
         * Points of this team
         */

        this.points = new ParentPointsHandler(this);

    }

    /**
     * Get the SubTeams of this ParentTeam
     * @return {TeamsHandler}
     */

    get subs () {
        console.log('sub type: ', this.manager.subs.type)
        // return this.manager.subs.filter(team => team.parent.id === this.id);
    }
}

module.exports = ParentTeam;