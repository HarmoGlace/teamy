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
                    guildId = null,
                    autoInitialize = false
                } = {}) {

            type = type.toLowerCase();

            this.initialized = false;

            if (client) this.client = client;
            if (guildId) this.guildId = guildId;

            if (!setPoints || !getPoints || typeof setPoints !== 'function' || typeof getPoints !== 'function') throw new TeamyError(`Please provide setPoints and getPoints functions`);
            if (!(teams instanceof Array)) throw new TeamyError(`Parameter teams should be an array, received ${typeof teams}`);

            this.teams = {
                all: [],
                add: (team) => {

                    if (typeof team !== 'object' || team instanceof Array) throw new TeamyError(`You need to specify an object in <TeamsManager>.teams.add`)
                    if (this.teams.get(team.id)) throw new TeamyError(`There is already a team with id ${team.id}`);

                    if (type === 'basic') {

                            this.teams.all.push(new Team(this, team));

                    } else if (type === 'advanced') {

                            if (!team.hasOwnProperty('type')) {
                                if (team.subs) team.type = 'parent'
                                else team.type = 'sub'
                            }

                            if (team.type === 'parent') {
                                if (!team.hasOwnProperty('subs')) {
                                    process.emitWarning(`You didn't provide any sub teams for the ${team.id} team`);
                                    team.subs = [];
                                }

                                const parentTeam = new ParentTeam(this, team);

                                const subs = team.subs.slice();

                                for (const sub of subs) {
                                    if (typeof sub !== 'object' || sub instanceof Array) throw new TeamyError(`Parameter teams should be an array of objects, instead received an array of ${sub.constructor.name}`);

                                    if (this.teams.get(sub.id)) throw new TeamyError(`Duplicated (Sub) team with id ${sub.id}`);

                                    const subTeam = new SubTeam(this, sub, parentTeam);

                                    this.teams.all.push(subTeam);
                                    parentTeam.subs.push(subTeam);
                                }

                                this.teams.all.push(parentTeam);

                                } else if (team.type === 'sub') {

                                const parentRaw = team.parentId || team.parent;

                                if (!parent) throw new TeamyError(`No ParentTeam provided for ${team.id} SubTeam`);

                                const parent = parentRaw instanceof ParentTeam ? parentRaw : this.teams.all.get(parentRaw);

                                if (!parent) throw new TeamyError(`Cannot find a ParentTeam for ${team.id} SubTeam`);

                                const subTeam = new SubTeam(this, team, parent);

                                this.teams.all.push(subTeam);
                                parent.subs = parent.subs.push(subTeam);

                            }
                    }

                    if (this.initialized) this.initialize();

                },
                remove: (teamRaw) => {

                    if (!teamRaw || !(teamRaw instanceof Team)) throw new TeamyError(`You need to provide a valid Team to delete`);

                    const team = this.teams.get(teamRaw.id);
                    const index = this.teams.all.indexOf(team);

                    this.teams.all.splice(index, 1);

                    return this.teams.all;

                },
                set: (teams) => {
                    if (!(teams instanceof Array)) throw new TeamyError(`You must specify an array in <TeamsManager>.teams.set, instead received ${teams.constructor.name})`);

                    this.teams = [];

                        for (const team of teams) {
                            this.teams.add(team);
                        }

                        return this.teams.all;


                },
                parents: () => {
                    return this.teams.all.filter(team => team.type === 'parent');
                },
                subs: () => {
                    return this.teams.all.filter(team => team.type === 'sub');
                },
                sorted: () => {
                    if (this.type === 'basic') return this.teams.all.sort((a, b) => b.points.get() - a.points.get());

                    const parents = this.teams.parents();

                    for (const parent of parents) {
                        parent.subs.sort((a, b) => b.points.get() - a.points.get());
                    }

                    return parents.sort((a, b) => b.points.get() - a.points.get());
                },
                get: (id) => {
                    return this.teams.all.find(team => team.id === id) || null;
                },
                find: (findFunction) => {
                    return this.teams.all.find(findFunction) || null;
                },
                resolve: (resolvable) => {
                    resolvable = resolvable.toLowerCase();
                    return this.teams.all.find(team => team.name.toLowerCase() === resolvable || team.id.toLowerCase() === resolvable || team.aliases.includes(resolvable)) || this.teams.all.find(team => resolvable.startsWith(team.name.toLowerCase()) || resolvable.startsWith(team.id.toLowerCase())) || null;
                },
            };

            this.type = type;

            this.functions = { setPoints, getPoints };


                if (!['basic', 'advanced'].includes(type)) throw new TeamyError(`TeamsManager type must be basic or advanced. Instead type was ${type}`);

                this.teams.set(teams);


        if (autoInitialize) this.initialize();

    }

    initialize () {
        if (this.client && this.client.user && this.guildId) {
            const guild = client.guilds.cache.get(this.guildId);
            if (guild) {
                for (const team of this.teams) {
                    if (team.roleId) team.role = guild.roles.cache.get(team.roleId);
                }
            }

        }
        this.initialized = true;
        return this;

    }

    getMemberTeam (member) {
        const teams = this.type === 'basic' ? this.teams.all : this.teams.subs();
        return teams.find(team => member.roles.cache.has(team.roleId)) || null;
    }
}

module.exports = TeamsManager;