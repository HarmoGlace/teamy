const SubPointsHandler = require('./SubPointsHandler');
const PointsHandler = require('./PointsHandler');

module.exports = (GuildMember, manager) => {

    /**
     * GuildMemberHandler
     */

    return class GuildMemberHandler extends GuildMember {

        #internalPoints

        constructor (...args) {
            super(...args);

            Object.defineProperty(this, 'manager', {
                value: manager,
                writable: false,
                configurable: false,
                enumerable: false
            });

            this.#internalPoints = new SubPointsHandler(this);
        }

        /**
         * Get the current member team
         * @return {Team|SubTeam|null|AnyTeam}
         */

        get team () {
            return this.manager.getMemberTeam(this);
        }

        /**
         * Get the current GuildMember teams
         * @return {Team[]|SubTeam[]|AnyTeam[]}
         */

        get teams () {
            return this.manager.getMemberTeams(this);
        }

        /**
         * Returns the PointsHandler of this GuildMember
         * @return {*|PointsHandler}
         */

        get points () {
            return this.team ? this.#internalPoints : new PointsHandler(this);
        }

        /**
         * Get the parent of this GuildMember (The team of this GuildMember)
         * @return {Team|SubTeam|null|AnyTeam}
         */

        get parent () {
            return this.team;
        }

    }
}

