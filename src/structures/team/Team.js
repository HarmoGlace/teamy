const TeamyError = require('../TeamyError');
const PointsHandler = require('../handlers/PointsHandler');
const TeamsHandler = require("../handlers/TeamsHandler");
const TeamMembersHandler = require("../handlers/TeamMembersHandler");
const { defineUnlistedProperty } = require('../util/Util');

/**
 * A teamy basic team
 */

class Team {

    #teamColor
    #internalGuildId

    /**
     *
     * @param {TeamsManager} manager The TeamsManager this team belong to
     * @param {TeamData} data The data of this team
     */

    constructor (manager, {
        id,
        name = id,
        aliases = [],
        color = null,
        role = null,
        guild = null
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



        this.#internalGuildId = guild;

        /**
         * The role id of this team
         * @type {String|null}
         */

        this.roleId = role;


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

    /**
     * The Guild Id of this team. If not set it will use the guildId property of TeamsManager. Used to get roles
     * @type {String|null}
     */

    get guildId () {
        return this.#internalGuildId || this.manager.guildId;
    }

    /**
     * Get the guild used by this Team. It is a [discord.js Guild](https://discord.js.org/#/docs/main/stable/class/Guild)
     * @return {Guild|null}
     */

    get guild () {
        return this.manager.client.guilds.cache.get(this.guildId) || null;
    }

    set guild (guildId) {
        this.#internalGuildId = guildId.toString();
    }

    /**
     * Get the Role of this team. It is a [discord.js Role](https://discord.js.org/#/docs/main/stable/class/Role)
     * @return {Role|null}
     */

    get role () {
        return this.guild?.roles.cache.get(this.roleId) || null;
    }

    set role (roleId) {
        this.roleId = roleId.toString();
    }

    get color () {
        return this.#teamColor || this.role?.color || null;
    }

    set color (color) {
        this.#teamColor = color;
    }
}

module.exports = Team;