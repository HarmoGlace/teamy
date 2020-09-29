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

    export class TeamMember {
        team?: SubTeam | Team;
        points: SubPointsHandler | PointsHandler;
        type: 'member';
    }

    export class TeamsManager implements TeamsHandler<String, AnyTeam> {
        constructor(options: TeamsManagerOptions);

        // @ts-ignore
        type: TeamsManagerType;
        client: any | null;
        defaultGuildId: string | null;
        defaultGuild: any | null;

        add(resolvable: TeamResolvable): AnyTeam;

        remove(team: AnyTeam | String): this;

        // @ts-ignore
        set(teams: TeamResolvable[]): this;

        implement: boolean;

        initialize(): boolean;

        functions: TeamsManagerFunctions;


    }

    export interface TeamsManagerOptions {
        type?: TeamsManagerType;
        teams?: TeamResolvable[];
        functions: TeamsManagerFunctions;
        client?: any;
        guild?: string;
        implement?: boolean;
        alwaysPool: boolean;
    }

    export interface TeamsManagerFunctions {
        setPoints: { (team: Team, points: number): any };
        getPoints: { (team: Team): number | null | Promise<number | null> };

        getMemberTeam(member: TeamMember): SubTeam | Team | null | Promise<SubTeam | Team | null>;

        getTeamMembers(team: AnyTeam): TeamMember[] | Promise<TeamMember[]>;
    }


    // @ts-ignore
    export interface TeamsHandler<ID, anything> extends Map<String, any> {
        constructor(options: TeamsHandlerOptions): this;

        manager?: TeamsManager | null;
        type: TeamsHandlerType | String;


        parents: ParentTeam[] | Team[];
        subs: SubTeam[] | Team[];

        keys: String[];
        values: any[];
        entries: Array<Array<String|any>>;



        add(team: AnyTeam): AnyTeam;

        sorted(): Promise<TeamsHandlerStocked>;

        clearAllPoints(recursive: Boolean): Promise<Boolean>;

        find(callback: TeamsHandlerCallback): TeamsHandlerStocked | null;

        filter(callback: TeamsHandlerCallback): TeamsHandler<String, any>;

        map(callback: TeamsHandlerMapCallback): TeamsHandler<String, any>;

        resolve(resolvable: string): TeamsHandlerStocked;

        toArray(): TeamsHandlerCallback[];
    }

    interface TeamsHandlerCallback {
        (team: TeamsHandlerStocked): Boolean;
    }

    interface TeamsHandlerMapCallback {
        (team: TeamsHandlerStocked): any;
    }

    export interface TeamsHandlerOptions {
        base: Array<Array<String | TeamsHandlerStocked>>;
    }

    export interface TeamMembersHandler {
        enabled: Boolean;

        fetch(): Promise<TeamMember[]>;

        latest: number | undefined;
    }

    export class Team {
        constructor(manager: TeamsManager, data: TeamData);

        members: TeamMembersHandler;
        id: string;
        name: string;
        aliases: string[];
        color: number|false;
        roleId: string | null;
        role: any | null;
        guildId: string | null;
        guild: any | null;
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
        latest: number | null | undefined;

        get(nullable: Boolean): Promise<number | null>;

        add(points: number): Promise<number>;

        remove(points: number): Promise<number>;

        set(points: number): Promise<number>;

        clear(recursive: Boolean): number;

        checkPoints(returnTeam: Boolean): Promise<this>;
    }

    interface SubPointsHandler extends PointsHandler {
        parent(): Promise<number>;

        current(): Promise<number>;

        setLocal(points: number): Promise<number>;
    }

    interface ParentPointsHandler extends PointsHandler {

    }

    type AnyTeam = Team | ParentTeam | SubTeam;
    type TeamsHandlerStocked = AnyTeam | TeamMember;


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