const TeamyError = require('../TeamyError');
const Team = require('./Team');
const ParentTeam = require('./ParentTeam');
const SubTeam = require('./SubTeam');
const TeamsHandler = require('./TeamsHandler');

/**
 * A TeamsManager
 */

class TeamsManager extends TeamsHandler {


    /**
     * @param {TeamsManagerData} data TeamsManager data
     */

    constructor ({
                     teams = [],
                     type = 'basic',
                     functions: {
                         setPoints,
                         getPoints
                     } = {},
                     client = null,
                     guildId = null,
                     autoInitialize = false,
                     implementMember = false,
                     alwaysPool = false
                 } = {}) {

        super();

        type = type.toLowerCase();

        /**
         * Whatever this manager has been initialized with the initialize method
         * @type {Boolean}
         */

        this.initialized = false;

        /**
         * Whatever or not to always pool when getting points
         */

        this.alwaysPool = alwaysPool;


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

        if (![ 'basic', 'advanced' ].includes(type)) throw new TeamyError(`TeamsManager type must be basic or advanced. Instead type was ${type}`);

        if (teams) this.set(teams);

        if (autoInitialize) this.initialize();

        if (this.implementMember) {
            const { Structures } = require('discord.js');
            const parent = this;
            const { getMemberTeam, getMemberTeams } = this;


            Structures.extend('GuildMember', GuildMember => {
                class TeamyGuildMember extends GuildMember {
                    constructor (client, data, guild) {
                        super(client, data, guild);
                    }

                    get team () {
                        return getMemberTeam.bind(parent)(this);
                    }

                    get teams () {
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

    initialize () {
        if (this.client && this.client.user && this.guildId) {
            const guild = this.client.guilds.cache.get(this.guildId);
            if (guild) {
                for (const team of this) {
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

    getMemberTeam (member) {
        const teams = this.type === 'basic' ? this.teams : this.teams.subs();
        return teams.find(team => member.roles.cache.has(team.roleId)) || null;
    }

    /**
     * Get a member teams
     * @param { GuildMember } member member to get teams
     * @returns {Team[] | SubTeam[]}
     */

    getMemberTeams (member) {
        const teams = this.type === 'basic' ? this.teams : this.teams.subs();
        return teams.filter(team => member.roles.cache.has(team.roleId));
    }

    /**
     * Sets the client of this TeamsManager
     * @param {Client} client Discord.js client
     * @returns {Client} Client provided
     */

    setClient (client) {
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
     * Remove all teams to keep have given teams
     * @param {Team|ParentTeam|SubTeam} teams Teams to keep
     * @returns {TeamsManager}
     */

    set (teams) {
        if (!(teams instanceof Array)) throw new TeamyError(`You must specify an array, instead received ${teams.constructor.name})`);

        super.clear();

        for (const team of teams) {
            this.add(team);
        }

        return this;

    }

    /**
     * All ParentTeam of this TeamsManager
     * @returns {TeamsHandler}
     */

    get parents () {
        return this.type === 'basic' ? this : new TeamsHandler(this.toArray().filter(team => team.type === 'parent').map(team => [ team.id, team ]));
    }

    /**
     * All SubTeam of this TeamsManager
     * @returns {TeamsHandler}
     */

    get subs () {
        return this.type === 'basic' ? this : new TeamsHandler(this.toArray().filter(team => team.type === 'sub').map(team => [ team.id, team ]));
    }

    /**
     * Teams sorted by their points
     * @params {Boolean} [forceSubs] Whatever or not to force subs
     * @returns {Team[]|ParentTeam[]}
     */

    async sorted (forceSubs = false) {

        const sortTeams = async (teams) => {
            const elements = await Promise.all(teams.map(async team => await team.points.checkPoints(true)));
            // console.log(elements)

            return elements.sort((a, b) => b.points.latest - a.points.latest);
        }

        if (this.type === 'basic' || forceSubs) return sortTeams((forceSubs ? this.subs : this).toArray());


        const parents = this.parents.toArray();

        for (const parent of parents) {
            parent.subs = await sortTeams(parent.subs);
        }

        return sortTeams(parents);
    }


}

module.exports = TeamsManager;
