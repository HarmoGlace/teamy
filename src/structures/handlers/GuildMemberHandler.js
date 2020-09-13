

module.exports = (GuildMember, manager) => {

    const GuildMemberPointsHandler = require('./GuildMemberPointsHandler')(manager.type);

    return class GuildMemberHandler extends GuildMember {

        #internalPoints
        #manager

        constructor (...args) {
            super(...args);
            this.#manager = manager;
            this.#internalPoints = new GuildMemberPointsHandler(this.team, this);
        }

        get team () {
            return this.#manager.getMemberTeam(this);
        }

        get teams () {
            return this.#manager.getMemberTeams(this);
        }

        get points () {
            if (this.team) {
                if (this.team?.id !== this.#internalPoints.team) this.#internalPoints.updateTeam(this.team)
                return this.#internalPoints
            }
            return null
        }

        get parent () {
            return this?.team.parent;
        }

    }
}

