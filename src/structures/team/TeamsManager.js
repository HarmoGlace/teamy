const TeamyError = require('../TeamyError');
const Team = require('./Team');
const ParentTeam = require('./ParentTeam');
const SubTeam = require('./SubTeam');
const TeamsHandler = require('../handlers/TeamsHandler');
const { defineUnlistedProperty } = require('../util/Util');

/**
 * A TeamsManager
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
     * @param {Client} [options.client] Discord.js client used to get roles.
     * @param {String} [options.guild] Guild id used by default to get roles. Can be overrided by Team#guild Need the client option
     * @param  {Boolean} [options.implementMember] If true it will add a team and teams properties to Discord.js GuildMembers. The client needs to be created after this manager
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
                     implementMember = false,
                 } = {}) {

        super({ base: [] });

        super.manager = this;

        defineUnlistedProperty('_constructed', super.constructor, this);

        type = type.toLowerCase();
        
        /**
         * Whatever or not to always pool when getting points
         * @type {Boolean}
         */

        defineUnlistedProperty('alwaysPool', alwaysPool, this);


        /**
         * Client option. If enabled it will add the `team` and `teams` properties on GuildMembers
         * @type {Boolean}
         */
        defineUnlistedProperty('implementMember', implementMember, this);

        defineUnlistedProperty('client', client || null, this);
        defineUnlistedProperty('guildId', guild || null, this);

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

        if (this.implementMember) {
            const { Structures } = require('discord.js');
            const TeamMember = require('./TeamMember');


            Structures.extend('GuildMember', (GuildMember) => TeamMember(GuildMember, this));

            defineUnlistedProperty('Structures', Structures, this);
        }

        if (teams) this.set(teams);


    }

    /**
     * Returns the Guild affected by this TeamsManger, if a client and a guildId are set
     * @return {Guild|null}
     */

    get teamsGuild () {
        return this.client?.guilds.cache.get(this.guildId);
    }

    set client (client) {
        defineUnlistedProperty('client', client, this);
    }

    /**
     * Add a Team to this TeamsManager
     * @param {TeamResolvable} team Team to add
     * @returns {SubTeam|ParentTeam|Team}
     */

    add (team) {

        if (typeof team !== 'object' || Array.isArray(team)) throw new TeamyError(`You need to specify an object`)
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
                    if (typeof sub !== 'object' || Array.isArray(sub)) throw new TeamyError(`Parameter teams should be an array of objects, instead received an array of ${sub.constructor.name}`);

                    if (this.get(sub.id)) throw new TeamyError(`Duplicated (Sub) team with id ${sub.id}. IDs should be unique`);

                    const subTeam = new SubTeam(this, sub, parentTeam);

                    super.set(subTeam.id, subTeam);

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
            this.add(team);
        }

        return this;

    }



}

module.exports = TeamsManager;
