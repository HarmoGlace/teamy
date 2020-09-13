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

            Object.defineProperty(this, 'type', {
                value: 'member',
                writable: false,
                configurable: false,
                enumerable: false
            });

            this.#internalPoints = new SubPointsHandler(this);
        }

        get team () {
            const found = this.manager.getMemberTeam(this);


            this.checkSavedTeam();

            return (found && found.constructor !== SubPointsHandler ? this.manager.get(found) : found) || null;

        }

        async checkSavedTeam () {
            const found = this.manager.getMemberTeam(this, this.manager.subs)?.id;
            const saved = (await this.manager.getSavedMemberTeam(this, this.manager.subs))?.id;

            if (found !== saved) await this.manager.setMemberTeam(found, this);

            return true;
        }

<<<<<<< Updated upstream
        get teams () {
            return this.manager.getMemberTeams(this);
        }
=======
        /**
         * Returns the PointsHandler of this GuildMember
         * @return {*|PointsHandler}
         */
>>>>>>> Stashed changes

        get points () {
            return this.team ? this.#internalPoints : new PointsHandler(this);
        }

        get parent () {
            return this.team;
        }

    }
}

