/**
 * @typedef {Object} TeamsManagerData
 * @property {Team[] | ParentTeam[]} [teams = []] List of teams
 * @property {TeamsManagerType} [type='basic'] The type of the TeamsManager
 * @property {TeamsManagerFunctions} functions Functions to store and get points
 * @property {Client} [client] Discord.js client used to get roles. Need the guildId option
 * @property {String} [guildId] Guild id used to get roles. Need the client option
 * @property {Boolean} [autoInitialize] If true it will fire the initialize method when creating the manager
 * @property  {Boolean} [implementMember] If true it will add a team and teams properties to Discord.js GuildMembers. The client needs to be created after this manager
 */

/**
 * The type of a TeamsManager. Can be :
 * * `basic`
 * * `advanced`
 * @typedef {String} TeamsManagerType
 */

exports.TeamsManagerType = [
        'basic',
        'advanced'
    ]

/**
 * A TeamResolvable can be :
 * * {@link TeamData}
 * * {@link Team}
 * * {@link SubTeam}
 * * {@link ParentTeam}
 * @typedef TeamResolvable
 */


/**
 * @typedef {Object} TeamData
 * @property {String} id Id of the team
 * @property {String} [name] Name of the team
 * @property {String[]} [aliases=[]] Team name aliases
 * @property {Number} [color] Team color
 * @property {String} [roleId] Team role ID
 */

/**
 @typedef {Object} TeamsManagerFunctions
 @property setPoints {function} Used to set the points of a team. Parameters : `team` and `points`
 @property getPoints {function} Used to get the points of a team. Parameter: `team`
 */


