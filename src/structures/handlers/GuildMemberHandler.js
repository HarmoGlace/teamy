const SubPointsHandler = require('./SubPointsHandler');
const PointsHandler = require('./PointsHandler');
const SubTeam = require("../team/SubTeam");
const { defineUnlistedProperty } = require('../util/Util');

module.exports = (GuildMember, manager) => {

    return class GuildMemberHandler extends GuildMember {

        #internalPoints
        #noTeamPoints

        constructor (...args) {
            super(...args);

            defineUnlistedProperty('manager', manager, this);

            /**
             * Defines the Type of this Class
             * @constant
             */

            this.type = 'member';


            this.#internalPoints = new SubPointsHandler(this);
            this.#noTeamPoints = new PointsHandler(this);
        }

        get team () {
            const found = this.manager.functions.getMemberTeam(this, this.manager.subs);

            return (found && found.constructor !== SubTeam ? this.manager.get(found) : found) || null;

        }


        /**
         * Returns the PointsHandler of this GuildMember
         * @return {*|PointsHandler}
         */

        get points () {
            return this.team ? this.#internalPoints : this.#noTeamPoints;
        }

        get parent () {
            return this.team;
        }

    }
}

