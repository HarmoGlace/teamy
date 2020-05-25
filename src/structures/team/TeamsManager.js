const TeamyError = require('../TeamyError');
const Team = require('./Team');
const ParentTeam = require('./ParentTeam');
const SubTeam = require('./SubTeam');
const TeamsHandler = require('../handlers/TeamsHandler');

/**
 * A TeamsManager
 */

class TeamsManager {


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
         * Teams handled by this TeamsManager
         * @type {TeamsHandler}
         */

        this.teams = new TeamsHandler(this);

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

        if (teams) this.teams.set(teams);

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
                for (const team of this.teams) {
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
}

module.exports = TeamsManager;
