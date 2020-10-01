const TeamyError = require('../TeamyError');
const Team = require('./Team');
const ParentTeam = require('./ParentTeam');
const SubTeam = require('./SubTeam');
const TeamsHandler = require('../handlers/TeamsHandler');
const { defineUnlistedProperty } = require('../util/Util');

/**
 * A TeamsManager. Extends {@link TeamsHandler}
 * @extends TeamsHandler
 */

class TeamsManager extends TeamsHandler {


    /**
     * TeamsManager
     */

    #privateGetMemberTeam

    /**
     * @param {Object} options Options to instantiate a TeamsManager
     * @param {TeamResolvable[]} [options.teams = []] List of teams
     * @param {TeamsManagerType} [options.type='basic'] The type of the TeamsManager
     * @param {TeamsManagerFunctions} options.functions Functions to store and get points
     * @param {Client} [options.client] [Discord.js client](https://discord.js.org/#/docs/main/stable/class/Client) used to get roles.
     * @param {String} [options.guild] Guild id used by default to get roles. Can be overrided by {@link Team#guild} Need the client option
     * @param {Boolean} [options.implement] If true it will replace [Discord.js GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember) to {@link TeamMember}, adding team and points properties. It will also replace [discord.js Guild](https://discord.js.org/#/docs/main/stable/class/Guild) to {@link TeamGuild}. The client needs to be created after this manager
     */

    constructor ({
                     teams = [],
                     type = 'basic',
                     functions: {
                         setPoints,
                         getPoints,
                         getMemberTeam = null,
                         getTeamMembers = null
                     } = {},
                     client = null,
                     guild = null,
                     implement = false,
                 } = {}) {

        super({ base: [] });

        super.manager = this;

        defineUnlistedProperty('_constructed', super.constructor, this);

        type = type.toLowerCase();


        /**
         * Client option. If enabled it will add the `team` and `teams` properties on GuildMembers
         * @type {Boolean}
         */
        defineUnlistedProperty('implement', implement, this);

        defineUnlistedProperty('client', client || null, this);
        defineUnlistedProperty('defaultGuildId', guild || null, this);

        if (!setPoints || !getPoints || typeof setPoints !== 'function' || typeof getPoints !== 'function') throw new TeamyError(`Please provide setPoints and getPoints functions`);
        if (!Array.isArray(teams)) throw new TeamyError(`Parameter teams should be an array, received ${typeof teams}`);


        if (![ 'basic', 'advanced' ].includes(type)) throw new TeamyError(`TeamsManager Type should be basic or advanced. Received ${type}`)

        /**
         * TeamsManager type, either
         * * `basic`
         * * `advanced`
         * @type {TeamsManagerType}
         */

        defineUnlistedProperty('type', type, this);

        /**
         * setPoints and getPoints functions of this TeamsManager
         * @type {TeamsManagerFunctions}
         */

        defineUnlistedProperty('functions', { setPoints, getPoints }, this);


        this.#privateGetMemberTeam = getMemberTeam || (member => this.subs.find(team => member.roles.cache.has(team.roleId)));

        /**
         * Get a member team
         * @param {GuildMember} member member to get team
         * @returns {Team | SubTeam | null} The member team or null if none is found
         */

        defineUnlistedProperty('getMemberTeam', (member) => {
            const found = this.#privateGetMemberTeam(member, this.subs);

            const returnType = this.type === 'basic' ? Team : SubTeam;

            if (found !== null && found.constructor !== returnType) throw new TeamyError(`getMemberTeam function should return a ${returnType.name} or null. Received ${found.constructor.name}`);

            return found;
        }, this.functions);


        if (getTeamMembers && typeof getTeamMembers === 'function') {
            defineUnlistedProperty('getTeamMembers', getTeamMembers, this.functions);


            defineUnlistedProperty('teamsFunctions', true, this);
        }


        if (![ 'basic', 'advanced' ].includes(type)) throw new TeamyError(`TeamsManager type must be basic or advanced. Instead type was ${type}`);

        if (this.implement) {
            const { Structures } = require('discord.js');
            const TeamMember = require('../implementations/TeamMember');
            const TeamGuild = require('../implementations/TeamGuild');


            Structures.extend('GuildMember', (GuildMember) => TeamMember(GuildMember, this));
            Structures.extend('Guild', (Guild) => TeamGuild(Guild, this));

            defineUnlistedProperty('Structures', Structures, this);
        }

        if (teams) this.set(teams);


    }

    /**
     * Get a TeamsHandler of guilds and their teams
     * @type {TeamsHandler<String, TeamsHandler<SubTeam|ParentTeam|Team>>}
     */

    get guilds () {

        const guilds = new TeamsHandler({
            base: [],
            type: 'guilds',
            manager: this
        })

        for (const team of this.toArray()) {

            const found = guilds.get(team.guildId);

            if (found) {
                found.set(team.id, team);
                continue;
            }

            guilds.set(team.guildId, new TeamsHandler({ base: [ [ team.id, team ] ], type: 'all', manager: this }));
        }

        return guilds;
    }

    /**
     * Returns the default Guild affected by this TeamsManger, if a client and a guild ID are set
     * @type {Guild|null}
     */

    get defaultGuild () {
        return this.client?.guilds.cache.get(this.guildId);
    }

    set client (client) {
        defineUnlistedProperty('client', client, this);
    }

    /**
     * Create a team from a {@link TeamResolvable} and add it to this TeamsManager
     * @param {TeamResolvable} teamResolvable Team to add
     * @returns {SubTeam|ParentTeam|Team}
     */

    create (teamResolvable) {

        if (typeof teamResolvable !== 'object' || Array.isArray(teamResolvable)) throw new TeamyError(`You need to specify an object`)
        if (this.get(teamResolvable.id)) throw new TeamyError(`There is already a team with id ${teamResolvable.id}`);

        if (this.type === 'basic') {

            const teamCreated = new Team(this, teamResolvable)

            super.set(teamCreated.id, teamCreated);

            return teamCreated;

        } else if (this.type === 'advanced') {

            if (!teamResolvable.hasOwnProperty('type')) {
                if (teamResolvable.subs) teamResolvable.type = 'parent'
                else teamResolvable.type = 'sub'
            }

            if (teamResolvable.type === 'parent') {

                if (!teamResolvable.hasOwnProperty('subs')) {
                    teamResolvable.subs = [];
                }

                const parentTeam = new ParentTeam(this, teamResolvable);

                const subs = teamResolvable.subs.slice();

                for (const sub of subs) {
                    if (typeof sub !== 'object' || Array.isArray(sub)) throw new TeamyError(`Parameter teams should be an array of objects, instead received an array of ${sub.constructor.name}`);

                    if (this.get(sub.id)) throw new TeamyError(`Duplicated (Sub) team with id ${sub.id}. IDs should be unique`);

                    const subTeam = new SubTeam(this, sub, parentTeam);

                    super.set(subTeam.id, subTeam);

                }

                super.set(parentTeam.id, parentTeam);

                return parentTeam;

            } else if (teamResolvable.type === 'sub') {

                const parentRaw = teamResolvable.parent;

                if (!parent) throw new TeamyError(`No ParentTeam provided for ${teamResolvable.id} SubTeam`);

                const parent = parentRaw instanceof ParentTeam ? parentRaw : this.get(parentRaw);

                if (!parent) throw new TeamyError(`Cannot find a ParentTeam for ${teamResolvable.id} SubTeam`);

                const subTeam = new SubTeam(this, teamResolvable, parent);

                super.set(subTeam.id, subTeam);

                return subTeam;

            }


        }

    }

    /**
     * Remove a teams from this TeamsManager
     * @param {TeamResolvable} team Team to remove
     * @returns {Team[]|Array<ParentTeam|SubTeam>}
     */

    remove (teamRaw = null) {

        const team = this.get(teamRaw) || this.get(teamRaw?.id);

        if (!team) throw new TeamyError(`You need to provide a valid Team to delete`);

        super.delete(team.id);

        return this;

    }


    /**
     * Remove all teams to keep have given teams
     * @param {Team|ParentTeam|SubTeam} teams Teams to keep
     * @returns {TeamsManager}
     */

    set (teams) {
        if (!Array.isArray(teams)) throw new TeamyError(`You must specify an array, instead received ${teams.constructor.name})`);

        super.clear();

        for (const team of teams) {
            this.create(team);
        }

        return this;

    }


}

module.exports = TeamsManager;
