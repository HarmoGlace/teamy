const TeamyError = require('../TeamyError');
const PointsHandler = require('../handlers/PointsHandler');
const TeamsHandler = require("../handlers/TeamsHandler");
const TeamMembersHandler = require("../handlers/TeamMembersHandler");
const { defineUnlistedProperty } = require('../util/Util');

/**
 * A teamy basic team
 */

class Team {

    /**
     *
     * @param {TeamsManager} manager The TeamsManager this team belong to
     * @param {TeamData} data The data of this team
     */

    #teamColor

    constructor (manager, {
        id,
        name = id,
        aliases = [],
        color = null,
        roleId = null
    } = {}) {

        /**
         * The TeamsManager this team belong to
         * @type {TeamsManager}
         */
        defineUnlistedProperty('manager', manager, this);

        /**
         * The ID of this team
         * @type {String}
         */
        this.id = id;


        /**
         * The name of this team
         * @type {String|null}
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
         * @type {String|null}
         */

        this.roleId = roleId;


        /**
         * The PointsHandler of this team
         * @type {PointsHandler}
         */

        this.points = new PointsHandler(this);

        /**
         * The TeamMembersHandler of this class
         * @type {TeamMembersHandler}
         */

        this.members = new TeamMembersHandler(this);

    }

    get color () {
        return this.#teamColor || this.role?.color || null;
    }

    set color (color) {
        this.#teamColor = color;
    }
}

module.exports = Team;