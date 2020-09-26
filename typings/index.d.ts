

declare enum TeamType {
    'parent',
    'sub',
    'default'
}

declare enum TeamsManagerType {
    'basic',
    'advanced'
}

declare enum TeamsHandlerType {
    'all',
    'subs',
    'parents',
    'unknown'
}

declare module 'teamy' {

    export class GuildMemberHandler {
        team?: SubTeam|Team;
        points: SubPointsHandler|PointsHandler;
        type: 'member';
    }

    export class TeamsManager implements TeamsHandler {
        constructor(options: TeamsManagerOptions);

        // @ts-ignore
        type: TeamsManagerType;
        alwaysPool: boolean;
        client: any|null;
        guildId: string|null;
        add(resolvable: TeamResolvable): AnyTeam;
        remove(team: AnyTeam|String): this;

        // @ts-ignore
        set (teams: TeamResolvable[]): this;
        initialized: boolean;
        implementMember: boolean;
        initialize(): boolean;
        functions: TeamsManagerFunctions;

        parents: ParentTeam[]|Team[];
        subs: SubTeam[]|Team[];

    }

    export interface TeamsManagerOptions {
        type?: TeamsManagerType;
        teams?: TeamResolvable[];
        functions: TeamsManagerFunctions;
        client?: any;
        guildId?: string;
        implementMember?: boolean;
        autoInitialize?: boolean;
        alwaysPool: boolean;
    }

    export interface TeamsManagerFunctions {
        setPoints: { (team: Team, points: number): number };
        getPoints: { (team: Team): number };

        getMemberTeam(member: GuildMemberHandler): SubTeam|Team|null;
        getTeamMembers(team: AnyTeam): GuildMemberHandler[];
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

    export interface TeamMembersHandler {
        enabled: Boolean;
        fetch(): GuildMemberHandler[];
        latest: number|undefined;
    }

    export class Team {
        constructor(manager: TeamsManager, data: TeamData);

        members: TeamMembersHandler;
        id: string;
        name: string;
        aliases: string[];
        color: number;
        roleId: string | null;
        points: PointsHandler;
        type: TeamType;
    }

    export class ParentTeam extends Team {
        // @ts-ignore
        members: undefined;
        subs: SubTeam[];
        points: ParentPointsHandler;
    }

    export class SubTeam extends Team {
        parent: ParentTeam;
        points: SubPointsHandler;
    }

    interface PointsHandler {
        latest: number|null|undefined;

        get(nullable: Boolean): number;

        add(points: number): number;

        remove(points: number): number;

        set(points: number): number;

        clear(recursive: Boolean): number;
        checkPoints(returnTeam: Boolean): this;
    }

    interface SubPointsHandler extends PointsHandler {
        parent(): number;

        current(): number;

        setLocal(points: number): void;
    }

    interface ParentPointsHandler extends PointsHandler {

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