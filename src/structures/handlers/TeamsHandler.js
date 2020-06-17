const TeamyError = require('../TeamyError');
const Team = require('../team/Team');
const ParentTeam = require('../team/ParentTeam');
const SubTeam = require('../team/SubTeam');


/**
 * Teams Handler used by the TeamsManager class
 * @extends Map
 */

class TeamsHandler extends Map {

    /**
     *
     * @param {TeamsManager} manager TeamsManager this TeamsHandler belong to
     */

    constructor (manager) {
        super();

        this.manager = manager;
    }


}

module.exports = TeamsHandler;