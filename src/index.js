module.exports = {

    // Teams

    TeamsManager: require('./structures/team/TeamsManager'),
    Team: require('./structures/team/Team'),
    ParentTeam: require('./structures/team/ParentTeam'),
    SubTeam: require('./structures/team/SubTeam'),
    TeamsHandler: require('./structures/team/TeamsHandler'),

    // Handlers

    PointsHandler: require('./structures/handlers/PointsHandler'),
    ParentPointsHandler: require('./structures/handlers/ParentPointsHandler'),
    SubPointsHandler: require('./structures/handlers/SubPointsHandler')
};