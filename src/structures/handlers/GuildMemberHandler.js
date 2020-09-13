const SubPointsHandler = require('./SubPointsHandler');
const PointsHandler = require('./PointsHandler');

module.exports = (GuildMember, manager) => {

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

        get team () {
            return this.manager.getMemberTeam(this);
        }

        /**
         * Returns the PointsHandler of this GuildMember
         * @return {*|PointsHandler}
         */

        get points () {
            return this.team ? this.#internalPoints : new PointsHandler(this);
        }

        get parent () {
            return this.team;
        }

    }
}

