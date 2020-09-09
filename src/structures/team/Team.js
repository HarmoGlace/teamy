const TeamyError = require('../TeamyError');
const PointsHandler = require('../handlers/PointsHandler');

/**
 * A teamy basic team
 */

class Team {

    /**
     *
     * @param {TeamsManager} manager The TeamsManager this team belong to
     * @param {TeamData} data The data of this team
     */

    constructor (manager, {
        id,
        name = id,
        aliases = [],
        color = 0x000000,
        roleId = null
    } = {}) {

        /**
         * The TeamsManager this team belong to
         * @type {TeamsManager}
         */
        this.manager = manager;

        /**
         * The ID of this team
         * @type {String}
         */
        this.id = id;


        /**
         * The name of this team
         * @type {!String}
         */

        this.name = name;

        /**
         * Default Team Type
         * @type {String}
         */

        this.type = 'default';


        /**
         * The name aliases of this team
         * @type {String[]}
         */

        this.aliases = aliases;


        /**
         * The color of this team
         * @type {Number}
         */

        this.color = color;

        /**
         * The role id of this team
         * @type {!String}
         */

        this.roleId = roleId;


        /**
         * The PointsHandler of this team
         * @type {PointsHandler}
         */

        this.points = new PointsHandler(this);


    }
}

module.exports = Team;