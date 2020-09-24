const TeamsHandler = require("./TeamsHandler");
const TeamyError = require("../TeamyError");
const { defineUnlistedProperty } = require('../util/Util');

/**
 * TeamsMemberHandler
 */

class TeamMembersHandler {

    /**
     * Instantiate the class
     * @param team The team this TeamMemberHandler belongs to
     */

    constructor (team) {

        defineUnlistedProperty('team', team, this);

        defineUnlistedProperty('manager', team.manager, this);


        /**
         * The latest members recorded. It is undefined if nothing was recorded
         * @type {TeamsHandler|undefined}
         */

        this.latest = undefined;
    }

    /**
     * Whatever this is enabled
     * @returns {Boolean} enabled
     */

    get enabled () {
        return this.manager.teamsFunctions && this.team.type !== 'parent'
    }

    /**
     * Get the GuildMembers only of the members who belongs to this team.
     * @return {Promise<TeamsHandler<GuildMemberHandler>|null>}
     */

    async fetch () {
        if (!this.enabled) return null;

        let returned = await Promise.all(await this.manager.functions.getTeamMembers(this.team));

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
}

module.exports = TeamMembersHandler;