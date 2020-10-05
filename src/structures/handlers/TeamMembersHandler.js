const TeamsHandler = require("./TeamsHandler");
const TeamyError = require("../TeamyError");
const { defineUnlistedProperty } = require('../util/Util');

/**
 * TeamMembersHandler. Used by {@link Team#members}
 */

class TeamMembersHandler {

    /**
     * Instantiate the class
     * @param team The team this TeamMembersHandler belongs to
     */

    constructor (team) {

        defineUnlistedProperty('team', team, this);

        defineUnlistedProperty('manager', team.manager, this);


        /**
         * The latest members recorded. It is false if nothing was recorded
         * @type {TeamsHandler<TeamMember>|false}
         */

        this.latest = false;
    }

    /**
     * Whatever this is enabled
     * @type {Boolean}
     */

    get enabled () {
        return !!this.manager.teamsFunctions;
    }

    /**
     * Get the GuildMembers only of the members who belongs to this team.
     * @param othersArgs Others arguments that will be passed to the getTeamMembers function
     * @return {Promise<TeamsHandler<TeamMember>|null>}
     */

    async fetch (...othersArgs) {
        if (!this.enabled) return null;

        let returned = await Promise.all(await this.manager.functions.getTeamMembers(this.team, ...othersArgs));

        const TeamMember = this.manager.Structures.get('GuildMember');

        if (returned && returned.constructor !== TeamsHandler && !Array.isArray(returned)) throw new TeamyError(`The getTeamMembers function should return a TeamsHandler / an Array of TeamMember. Instead received ${returned.constructor.name}`);

        const returnedArray = returned instanceof TeamsHandler ? returned.toArray() : returned;

        if (returned) {
            for (const member of returnedArray) {
                if (!(member instanceof TeamMember)) throw new TeamyError(`The getMemberTeams function should return a TeamsHandler / an Array of TeamMember. Instead received ${returned.constructor.name} of ${member.constructor.name}`)
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