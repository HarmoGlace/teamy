const SubTeam = require("../team/SubTeam");
const { defineUnlistedProperty } = require('../util/Util');

module.exports = (Guild, manager) => {

    /**
     * A TeamGuild
     */

    class TeamGuild extends Guild {

        #internalPoints
        #noTeamPoints

        /**
         * Instantiates this TeamGuild. Should not be done manually, discord.js will do it for you
         */

        constructor (...args) {
            super(...args);

            defineUnlistedProperty('manager', manager, this);

            /**
             * Defines the Type of this Class: `guild`
             * @constant
             * @type {String}
             */

            this.type = 'guild';
        }

        /**
         * The Teams belonging to this Guild
         * @type {TeamsHandler<Team|SubTeam|ParentTeam>}
         */

        get teams () {
            return this.manager.filter(team => team.guildId === this.id);
        }

    }

    return TeamGuild;

}

