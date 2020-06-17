const TeamyError = require('../TeamyError');
const Team = require('./Team');
const ParentTeam = require('./ParentTeam');
const SubTeam = require('./SubTeam');

/**
 * A TeamsManager
 */

class TeamsManager extends Map {


    /**
     * @param {TeamsManagerData} data TeamsManager data
     */

    constructor({
                    teams = [],
                    type = 'basic',
                    functions: {
                        setPoints,
                        getPoints
                    } = {},
                    client = null,
                    guildId = null,
                    autoInitialize = false,
                    implementMember = false
                } = {}) {

        super();

        type = type.toLowerCase();

        /**
         * Whatever this manager has been initialized with the initialize method
         * @type {Boolean}
         */
        this.initialized = false;


        /**
         * Client option. If enabled it will add the `team` and `teams` properties on GuildMembers
         * @type {Boolean}
         * @private
         */
        this.implementMember = implementMember;

        if (client) this.client = client;
        if (guildId) this.guildId = guildId;

        if (!setPoints || !getPoints || typeof setPoints !== 'function' || typeof getPoints !== 'function') throw new TeamyError(`Please provide setPoints and getPoints functions`);
        if (!(teams instanceof Array)) throw new TeamyError(`Parameter teams should be an array, received ${typeof teams}`);

        /**
         * TeamsManager type, either
         * * `basic`
         * * `advanced`
         * @type {TeamsManagerType}
         */

        this.type = type;

        /**
         * setPoints and getPoints functions of this TeamsManager
         * @type {TeamsManagerFunctions}
         */

        this.functions = { setPoints, getPoints };

        if (!['basic', 'advanced'].includes(type)) throw new TeamyError(`TeamsManager type must be basic or advanced. Instead type was ${type}`);

        if (teams) this.set(teams);

        if (autoInitialize) this.initialize();

        if (this.implementMember) {
            const { Structures } = require('discord.js');
            const parent = this;
            const {getMemberTeam, getMemberTeams} = this;


            Structures.extend('GuildMember', GuildMember => {
                class TeamyGuildMember extends GuildMember {
                    constructor(client, data, guild) {
                        super(client, data, guild);
                    }

                    get team() {
                        return getMemberTeam.bind(parent)(this);
                    }

                    get teams() {
                        return getMemberTeams.bind(parent)(this);
                    }
                }

                return TeamyGuildMember;
            });
        }

    }

    /**
     * Initialize this TeamsManager : Creates a role property for each Team
     * @returns {Boolean} true if successful
     */

    initialize() {
        if (this.client && this.client.user && this.guildId) {
            const guild = this.client.guilds.cache.get(this.guildId);
            if (guild) {
                for (const team of this.teams.all) {
                    if (team.roleId) team.role = guild.roles.cache.get(team.roleId);
                }
                this.initialized = true;
            }

        }

        return this.initialized;

    }


    /**
     * Get a member team
     * @param {GuildMember} member member to get team
     * @returns {Team | SubTeam | null} The member team or null if none is found
     */

    getMemberTeam(member) {
        const teams = this.type === 'basic' ? this.teams.all : this.teams.subs();
        return teams.find(team => member.roles.cache.has(team.roleId)) || null;
    }

    /**
     * Get a member teams
     * @param { GuildMember } member member to get teams
     * @returns {Team[] | SubTeam[]}
     */

    getMemberTeams(member) {
        const teams = this.type === 'basic' ? this.teams.all : this.teams.subs();
        return teams.filter(team => member.roles.cache.has(team.roleId));
    }

    /**
     * Sets the client of this TeamsManager
     * @param {Client} client Discord.js client
     * @returns {Client} Client provided
     */

    setClient(client) {
        return this.client = client;
    }

    /**
     * Add a Team to this TeamsManager
     * @param {TeamResolvable} team Team to add
     * @returns {SubTeam|ParentTeam|Team}
     */

    add (team) {

        if (typeof team !== 'object' || team instanceof Array) throw new TeamyError(`You need to specify an object`)
        if (this.get(team.id)) throw new TeamyError(`There is already a team with id ${team.id}`);

        if (this.type === 'basic') {

            const teamCreated = new Team(this, team)

            super.set(teamCreated.id, teamCreated);

            return teamCreated;

        } else if (this.type === 'advanced') {

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

                    if (this.get(sub.id)) throw new TeamyError(`Duplicated (Sub) team with id ${sub.id}`);

                    const subTeam = new SubTeam(this, sub, parentTeam);

                    super.set(subTeam.id, subTeam);
                    parentTeam.subs.push(subTeam);
                }

                super.set(parentTeam.id, parentTeam);

                return parentTeam;

            } else if (team.type === 'sub') {

                const parentRaw = team.parentId || team.parent;

                if (!parent) throw new TeamyError(`No ParentTeam provided for ${team.id} SubTeam`);

                const parent = parentRaw instanceof ParentTeam ? parentRaw : this.get(parentRaw);

                if (!parent) throw new TeamyError(`Cannot find a ParentTeam for ${team.id} SubTeam`);

                const subTeam = new SubTeam(this, team, parent);

                super.set(subTeam.id, subTeam);
                parent.subs = parent.subs.push(subTeam);

                return subTeam;

            }


        }

        if (this.initialized) this.initialize();

    }

    /**
     * Remove a teams from this TeamsManager
     * @param {TeamResolvable} team Team to remove
     * @returns {Team[]|Array<ParentTeam|SubTeam>}
     */

    remove (teamRaw) {

        if (!teamRaw || !(teamRaw instanceof Team) || !this.get(teamRaw.id)) throw new TeamyError(`You need to provide a valid Team to delete`);

        super.delete(teamRaw.id);

        return this;

    }

    /**
     * Gets a Team with its id
     * @param {String} id Team Id
     * @returns {Team|SubTeam|ParentTeam|null} the team or null if none was found
     */

    get (id) {
        return super.get(id) || null;
    }

    /**
     * Remove all teams to keep have given teams
     * @param {Team|ParentTeam|SubTeam} teams Teams to keep
     * @returns {Team[]|Array<ParentTeam|SubTeam>}
     */

    set (teams) {
        if (!(teams instanceof Array)) throw new TeamyError(`You must specify an array in <TeamsManager>.teams.set, instead received ${teams.constructor.name})`);

        this.clear();

        for (const team of teams) {
            this.add(team);
        }

        return this;


    }

    /**
     * All ParentTeam of this TeamsHandler
     * @returns {ParentTeam[]}
     */

    parents () {
        return this.toArray().filter(team => team.type === 'parent');
    }

    /**
     * All SubTeam of this TeamsHandler
     * @returns {SubTeam[]}
     */

    subs () {
        return this.toArray().filter(team => team.type === 'sub');
    }

    /**
     * Teams sorted by their points
     * @returns {Team[]|ParentTeam[]}
     */

    sorted () {
        if (this.type === 'basic') return this.toArray().sort((a, b) => b.points.get() - a.points.get());

        const parents = this.parents();

        for (const parent of parents) {
            parent.subs.sort((a, b) => b.points.get() - a.points.get());
        }

        return parents.sort((a, b) => b.points.get() - a.points.get());
    }


    /**
     * Clear points of all teams
     * @return {boolean} successful Return true if successful
     */

    clearAllPoints () {

        for (const team of this.toArray()) {
            team.points.clear();
        }

        return true;
    }

    /**
     * Find a team with a function
     * @param {function} findFunction function passed to find a team
     * @returns {Team|ParentTeam|SubTeam|null}
     */

    find(findFunction) {
        return this.toArray().find(findFunction) || null;
    }


    /**
     * Resolve a team with a string
     * @param {String} resolvable
     * @returns {Team|ParentTeam|SubTeam|null}
     */

    resolve (resolvable) {
        resolvable = resolvable.toLowerCase();
        return this.find(team => team.name.toLowerCase() === resolvable || team.id.toLowerCase() === resolvable || team.aliases.includes(resolvable)) || this.find(team => resolvable.startsWith(team.name.toLowerCase()) || resolvable.startsWith(team.id.toLowerCase())) || null;
    }

    /**
     * Convert this TeamsHandler to an Array
     * @return {Team[]|Array<ParentTeam|SubTeam>}
     */

    toArray () {
        return Array.from(this.values());
    }
}

module.exports = TeamsManager;
