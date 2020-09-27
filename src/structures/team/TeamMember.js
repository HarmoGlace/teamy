const SubPointsHandler = require('../handlers/SubPointsHandler');
const PointsHandler = require('../handlers/PointsHandler');
const SubTeam = require("./SubTeam");
const { defineUnlistedProperty } = require('../util/Util');

module.exports = (GuildMember, manager) => {

    /**
     * A TeamMember
     */

    class TeamMember extends GuildMember {

        #internalPoints
        #noTeamPoints

        /**
         * Instantiates this TeamMember. Should not be done manually
         */

        constructor (...args) {
            super(...args);

            defineUnlistedProperty('manager', manager, this);

            /**
             * Defines the Type of this Class: `member`
             * @constant
             * @type {String}
             */

            this.type = 'member';


            this.#internalPoints = new SubPointsHandler(this);
            this.#noTeamPoints = new PointsHandler(this);
        }

        /**
        * The Team this member belongs to if there is one
         * @type {Team|SubTeam|null}
         */

        get team () {
            const found = this.manager.functions.getMemberTeam(this, this.manager.subs);

            return (found && found.constructor !== SubTeam ? this.manager.get(found) : found) || null;

        }


        /**
         * Returns the PointsHandler of this TeamMember. Returns a basic points handler if the member is not in a team
         * @type {SubPointsHandler|PointsHandler}
         */

        get points () {
            return this.team ? this.#internalPoints : this.#noTeamPoints;
        }

        get parent () {
            return this.team;
        }

    }

    return TeamMember;

}

