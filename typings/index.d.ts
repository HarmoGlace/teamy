

declare enum TeamType {
    'parent',
    'sub'
}

declare enum TeamsManagerType {
    'basic',
    'advanced'
}

declare enum TeamsHandlerType {
    'all',
    'subs',
    'parents',
    'uknown'
}

declare module 'teamy' {

    export class GuildMemberHandler {
        team?: SubTeam|Team;
        points: SubPointsHandler|PointsHandler
    }

    export class TeamsManager {
        constructor(options: TeamsManagerOptions);

        type: TeamsManagerType;
        initialized: boolean;
        implementMember: boolean;
        initialize(): boolean;
        functions: TeamsManagerFunctions;

        parents: ParentTeam[];
        subs: SubTeam[];

    }

    export interface TeamsManagerOptions {
        type?: TeamsManagerType;
        teams?: TeamResolvable[];
        functions: TeamsManagerFunctions;
        client?: any;
        guildId?: string;
        implementMember?: boolean;
        autoInitialize?: boolean;
    }

    export interface TeamsManagerFunctions {
        setPoints: { (team: Team, points: number): number };
        getPoints: { (team: Team): number };
    }

    export interface TeamsHandler extends Map<String, TeamsHandlerStocked> {
        constructor(options: TeamsHandlerOptions): this;

        manager?: TeamsManager|null;
        type: TeamsHandlerType|String;



        add(team: AnyTeam): AnyTeam;

        sorted(): TeamsHandlerStocked;

        clearAllPoints(recursive: Boolean): Boolean;

        find(callback: TeamsHandlerCallback): TeamsHandlerStocked|null;

        filter(callback: TeamsHandlerCallback): TeamsHandlerCallback[];

        resolve(resolvable: string): TeamsHandlerStocked;

        toArray(): TeamsHandlerCallback[];
    }

    interface TeamsHandlerCallback {
        (team: TeamsHandlerStocked): Boolean;
    }

    export interface TeamsHandlerOptions {
        base: Array<Array<String|TeamsHandlerStocked>>;
    }

    export class Team {
        constructor(manager: TeamsManager, data: TeamData);

        id: string;
        name: string;
        aliases: string[];
        color: number;
        roleId: string | null;
        points: PointsHandler
    }

    export class ParentTeam extends Team {
        type: string;
        subs: SubTeam[];
    }

    export class SubTeam extends Team {
        type: string;
        parent: ParentTeam;
        points: SubPointsHandler;
    }

    interface PointsHandler {
        get(): number;

        add(points: number): void;

        remove(points: number): void;

        set(points: number): void;
    }

    interface SubPointsHandler extends PointsHandler {
        parent(): number;

        current(): number;

        setLocal(points: number): void;
    }

    type AnyTeam = Team | ParentTeam | SubTeam;
    type TeamsHandlerStocked= AnyTeam|GuildMemberHandler;


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