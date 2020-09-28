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
 * @property {String} [role] Team role Id
 * @property {ParentTeam} [parent] Parent Team of this team. Only needed if this team is a {@link SubTeam}
 * @property {SubTeam[]} [subs] Sub Teams of this team. Only needed if this team is a {@link ParentTeam}
 */

/**
 @typedef {Object} TeamsManagerFunctions
 @property setPoints {function} Used to set the points of a team. Parameters : `team` and `points`. Should return a Number
 @property getPoints {function} Used to get the points of a team. Parameter: `team`. Should return a Number
 @property [getMemberTeam] {function} Used to know the team of a {@link TeamMember}. Parameter: `member`. Should return a {@link Team} or a {@link SubTeam}
 @property [getTeamsMembers] {function} Used to know the members of a {@link Team} (or {@link ParentTeam}/{@link SubTeam}). Parameter: `team`. Should return an array of {@link TeamMember}
 */



