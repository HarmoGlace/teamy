module.exports = {

    // Teams

    TeamsManager: require('./structures/team/TeamsManager'),
    Team: require('./structures/team/Team'),
    ParentTeam: require('./structures/team/ParentTeam'),
    SubTeam: require('./structures/team/SubTeam'),
    TeamsHandler: require('./structures/handlers/TeamsHandler'),

    // Handlers

    PointsHandler: require('./structures/handlers/PointsHandler'),
    SubPointsHandler: require('./structures/handlers/SubPointsHandler'),
    GuildMemberHandler: require('./structures/handlers/GuildMemberHandler')
};