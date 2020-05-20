const TeamyError = require('../TeamyError');
const Team = require('./Team');
const ParentTeam = require('./ParentTeam');
const SubTeam = require('./SubTeam');

class TeamsManager {
    constructor({
                    teams = [],
                    type = 'basic',
                    functions: {
                    setPoints ,
                    getPoints
            } = {},
                    client = null,
                    guildId = null
                } = {}) {

            if (client) this.client = client;
            if (guildId) this.guildId = guildId;

            if (!setPoints || !getPoints || typeof setPoints !== 'function' || typeof getPoints !== 'function') throw new TeamyError(`Please provide setPoints and getPoints functions`);
            if (!(teams instanceof Array)) throw new TeamyError(`Paramater teams should be an array, received ${typeof teams}`);

            this.teams = {
                all: [],
                parents: () => {
                    return this.teams.parents.filter(team => team.type === 'parent');
                },
                subs: () => {
                    return this.teams.all.filter(team => team.type === 'sub');
                },
                get: (id) => {
                    return this.teams.all.find(team => team.id === id);
                },
                find: (findFunction) => {
                    return this.teams.all.find(findFunction);
                },
                resolve: (resolvable) => {
                    resolvable = resolvable.toLowerCase();
                    return this.teams.all.find(team => team.name.toLowerCase() === resolvable || team.id.toLowerCase() === resolvable || team.aliases.includes(resolvable)) || this.teams.all.find(team => resolvable.startsWith(team.name.toLowerCase()) || resolvable.startsWith(team.id.toLowerCase()));
                },
            };

            this.type = type.toLowerCase();

            this.functions = { setPoints, getPoints };

            if (type === 'basic') {
                for (const team of teams) {
                    if (typeof team !== 'object' || team instanceof Array) throw new TeamyError(`Paramater teams should be an array of objects, instead received an array of ${typeof team === 'object' ? 'array' : typeof team}`);
                    if (this.teams.all.find(team => team.id === parent.id)) throw new TeamyError(`Duplicated team with id ${team.id}`);

                    this.teams.all.push(new Team(this, team));
                }
            } else if (type === 'advanced') {

                for (const parent of teams) {
                    if (typeof parent !== 'object' || parent instanceof Array) throw new TeamyError(`Parameter teams should be an array of objects, instead received an array of ${typeof parent === 'object' ? 'array' : typeof parent}`);
                    if (this.teams.all.find(team => team.id === parent.id)) throw new TeamyError(`Duplicated Parent team with id ${parent.id}`);

                    const parentTeam = new ParentTeam(this, parent);

                    const subs = parent.subs.slice();

                    for (const sub of subs) {
                        if (typeof sub !== 'object' || sub instanceof Array) throw new TeamyError(`Parameter teams should be an array of objects, instead received an array of ${typeof sub === 'object' ? 'array' : typeof sub}`);

                        if (this.teams.all.filter(team => team.type === 'sub').find(team => team.id === sub.id)) throw new TeamyError(`Duplicated Sub team with id ${sub.id}`);

                        const subTeam = new SubTeam(this, sub, parentTeam);

                        this.teams.all.push(subTeam);
                        parentTeam.subs.push(subTeam);
                    }

                    console.log(parentTeam)

                    this.teams.all.push(parentTeam);
                }

            } else {
                throw new TeamyError(`TeamsManager type must be basic or advanced. Instead type was ${type}`);
            }



    }

    initialize() {
        if (this.client && this.client.user && this.guildId) {
            const guild = client.guilds.cache.get(this.guildId);
            if (guild) {
                for (const team of this.teams) {
                    if (team.roleId) team.role = guild.roles.cache.get(team.roleId);
                }
            }

        }

    }

    getMemberTeam(member) {
        const teams = this.type === 'basic' ? this.teams.all : this.teams.subs();
        return teams.find(team => member.roles.cache.has(team.roleId));
    }
}

module.exports = TeamsManager;