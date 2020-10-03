module.exports = {

    // Teams

    TeamsManager: require('./structures/team/TeamsManager'),
    Team: require('./structures/team/Team'),
    ParentTeam: require('./structures/team/ParentTeam'),
    SubTeam: require('./structures/team/SubTeam'),

    // discord.js edits

    TeamMember: require('./structures/implementations/TeamMember'),
    TeamGuild: require('./structures/implementations/TeamGuild'),


    // Handlers
    TeamsHandler: require('./structures/handlers/TeamsHandler'),

    PointsHandler: require('./structures/handlers/PointsHandler'),
    SubPointsHandler: require('./structures/handlers/SubPointsHandler'),
    ParentPointsHandler: require('./structures/handlers/ParentPointsHandler'),

    TeamMembersHandler: require('./structures/handlers/TeamMembersHandler'),

    // Util
    Util: require('./structures/util/Util'),
    DataFormatter: require('./structures/util/DataFormatter')
};