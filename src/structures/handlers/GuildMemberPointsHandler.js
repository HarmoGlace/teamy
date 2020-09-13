const files = {
    basic: './PointsHandler',
    advanced: './SubPointsHandler'
}

module.exports = (type) => {

    const Extendable = require(files[type]);

    return class GuildMemberPointsHandler extends Extendable {

        constructor (manager, member) {
            super(member);
            this.member = member;
            if (this.member.team) this.updateTeam(this.member.team)
        }

        async get () {
            console.log(this.team)
            console.log(super.constructor.name, super.team);
            return super.get();
        }

        async add (points) {
            super.add(points);
            this.team.add(points);
        }

        async set (points) {
            super.set(points);
            this.team
        }

        async setLocal (points) {

            if (isNaN(points)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

            return await this.team.manager.functions.setPoints(this.member, points);
        }

        updateTeam (newTeam) {
            this.team = newTeam;
            super.team = newTeam;
        }

    }
}



