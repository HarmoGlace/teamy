declare enum TeamType {
    'parent',
    'sub'
}

declare enum TeamsManagerType {
    'basic',
    'advanced'
}

declare module 'teamy' {

    export class TeamsManager {
        constructor(options: TeamsManagerOptions);
        type: TeamsManagerType;
        teams: TeamsManager;
        initialized: boolean;
        implementMember: boolean;
        initialize () : boolean;
        getMemberTeam (member: any) : AnyTeam | null;
        getMemberTeams (member: any) : AnyTeam[];
    }

    interface TeamsManagerOptions {
        type?: TeamsManagerType
        teams?: TeamResolvable[],
        functions: {
            setPoints: { (team: Team, points: number) : void };
            getPoints: { (team: Team) : number };
        }
        client?: any,
        guildId?: string;
        implementMember?: boolean;
        autoInitialize?: boolean;
    }

    interface TeamsHandler {
        all: Team[] | (ParentTeam | SubTeam)[];
        add (team: AnyTeam) : AnyTeam;
        remove (team: AnyTeam) : TeamsHandler['all'];
        set (teams: TeamsHandler['all']) : TeamsHandler['all'];
        parents () : ParentTeam[];
        subs () : SubTeam[];
        sorted () : TeamsHandler['all'];
        find (findFunction: string) : AnyTeam | null
        get (id: string) : TeamsHandler['find'];
        resolve (resolvable: string) : TeamsHandler['find'];
    }
    
    export class Team {
        constructor(manager: TeamsManager, data: TeamData);
        id: string;
        name: string;
        aliases: string[];
        color: number;
        roleId: string | null;
        points: TeamsPointsHandler
    }

    export class ParentTeam extends Team {
        type: string;
        subs: SubTeam[];
    }

    export class SubTeam extends Team {
        type: string;
        parent: ParentTeam;
        points: SubTeamsPointsHandler;
    }

    interface TeamsPointsHandler {
        get () : number;
        add (points: number) : void;
        remove (points: number) : void;
        set (points: number) : void;
    }

    interface SubTeamsPointsHandler extends TeamsPointsHandler {
        parent () : number;
        current () : number;
        setLocal (points: number) : void;
    }

    type AnyTeam = Team | ParentTeam | SubTeam;




    type ParentTeamResolvable = ParentTeamData | ParentTeam;

    type SubTeamResolvable = SubTeamData | SubTeam;

    type BasicTeamResolvable = TeamData | Team;

    type TeamResolvable = ParentTeamResolvable | SubTeamResolvable | BasicTeamResolvable;

    interface TeamData {
        id: string;
        name?: string;
        aliases?: string[];
        color?: number;
        roleId?: string;
    }



    interface ParentTeamData extends TeamData {
        type?: TeamType,
        subs: TeamResolvable[]
    }

    interface SubTeamData extends TeamData {
        type?: TeamType,
        parent?: string | ParentTeam
    }

}