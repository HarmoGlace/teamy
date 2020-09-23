const TeamyError = require('../TeamyError');
const PointsHandler = require('../handlers/PointsHandler');
const TeamsHandler = require("../handlers/TeamsHandler");
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

    /**
     * Whatever this Team can store members
     * @return {Boolean}
     */

    get membersEnabled () {
        return this.manager.teamsFunctions && this.type !== 'parent'
    }

    /**
     * Get the GuildMembers only of the members who belongs to this team.
     * @return {Promise<TeamsHandler<GuildMemberHandler>|null>}
     */

    async members () {
        if (!this.membersEnabled) return null;

        let returned = await Promise.all(await this.manager.functions.getTeamMembers(this));

        const GuildMemberHandler = this.manager.Structures.get('GuildMember');

        if (returned && returned.constructor !== TeamsHandler && !Array.isArray(returned)) throw new TeamyError(`The getTeamMembers function should return a TeamsHandler / an Array of GuildMemberHandler. Instead received ${returned.constructor.name}`);

        const returnedArray = returned?.constructor === TeamsHandler ? returned.toArray() : returned;

        if (returned) {
            for (const member of returnedArray) {
                if (member.constructor !== GuildMemberHandler) throw new TeamyError(`The getMemberTeams function should return a TeamsHandler / an Array of GuildMemberHandler. Instead received ${returned.constructor.name} of ${member.constructor.name}`)
            }

            returned = new TeamsHandler({
                base: returnedArray.map(member => [ member.id, member ]),
                type: 'member',
                manager: this.manager
            });
        }

        return returned || null;
    }

    get color () {
        return this.#teamColor || this.role?.color || null;
    }

    set color (color) {
        this.#teamColor = color;
    }
}

module.exports = Team;