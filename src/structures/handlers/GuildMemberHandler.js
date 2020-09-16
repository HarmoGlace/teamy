const SubPointsHandler = require('./SubPointsHandler');
const PointsHandler = require('./PointsHandler');

module.exports = (GuildMember, manager) => {

    return class GuildMemberHandler extends GuildMember {

        #internalPoints
        #noTeamPoints

        constructor (...args) {
            super(...args);

            Object.defineProperty(this, 'manager', {
                value: manager,
                writable: false,
                configurable: false,
                enumerable: false
            });

            Object.defineProperty(this, 'type', {
                value: 'member',
                writable: false,
                configurable: false,
                enumerable: false
            });

            this.#internalPoints = new SubPointsHandler(this);
            this.#noTeamPoints = new PointsHandler(this);
        }

        get team () {
            const found = this.manager.getMemberTeam(this, this.manager.subs);

            this.checkSavedTeam();

            return (found && found.constructor !== SubPointsHandler ? this.manager.get(found) : found) || null;

        }

        async checkSavedTeam () {
            if (!this.manager.teamsFunctions) return false;
            const found = this.manager.getMemberTeam(this, this.manager.subs)?.id;
            const saved = (await this.manager.getSavedMemberTeam(this, this.manager.subs))?.id;
            
            if (found !== saved) await this.manager.setMemberTeam(found ? this.manager.subs.get(found) : null, this);

            return true;
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

