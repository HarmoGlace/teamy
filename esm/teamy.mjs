import Teamy from '../src/index';

export default Teamy;

export const {
    TeamsManager,
    Team,
    ParentTeam,
    SubTeam,
    TeamMember,


    TeamsHandler,
    PointsHandler,
    SubPointsHandler,
    ParentPointsHandler,
    TeamMembersHandler,

    /**
     * @deprecated Use TeamMember instead
     */
    GuildMemberHandler
} = Teamy;