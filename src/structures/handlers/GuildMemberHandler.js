const SubPointsHandler = require('./SubPointsHandler');

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

        get teams () {
            return this.manager.getMemberTeams(this);
        }

        get points () {
            return this.team ? this.#internalPoints : null;
        }

        get parent () {
            return this.team;
        }

    }
}

