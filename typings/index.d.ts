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
    'unknown',
    'custom'
}

declare module 'teamy' {

    export class TeamMember {
        team?: SubTeam | Team;
        points: SubPointsHandler | PointsHandler;
        type: 'member';
    }

    export class TeamGuild {
        teams: AnyTeam[];
    }

    export class TeamsManager implements TeamsHandler<String, AnyTeam> {
        constructor(options: TeamsManagerOptions);

        // @ts-ignore
        type: TeamsManagerType;
        client: any | null;
        defaultGuildId: string | null;
        defaultGuild: TeamGuild | null;
        guilds: TeamsHandler<String, TeamsHandler<String, TeamsHandlerStocked>>;

        add(resolvable: TeamResolvable): AnyTeam;

        remove(team: AnyTeam | String): this;

        // @ts-ignore
        set(teams: TeamResolvable[]): this;

        implement: boolean;

        functions: TeamsManagerFunctions;


    }

    export interface TeamsManagerOptions {
        type?: TeamsManagerType;
        teams?: TeamData[];
        functions: TeamsManagerFunctions;
        client?: any;
        guild?: string;
        implement?: boolean;
        alwaysPool: boolean;
    }

    export interface TeamsManagerFunctions {
        setPoints(team: Team, points: number): any;

        getPoints(team: Team): number | null | Promise<number | null>;

        formatPoints(data: formatPointsOption, ...othersArgs: any): any | Promise<any>;

        getMemberTeam(member: TeamMember): SubTeam | Team | null | Promise<SubTeam | Team | null>;

        getTeamMembers(team: AnyTeam): TeamMember[] | Promise<TeamMember[]>;
    }

    export interface formatPointsOption {
        value: number;
        source: TeamsHandlerStocked
    }

    export class DataFormatter {
        constructor(manager: TeamsManager, options: DataFormatterOptions);

        formatted: any | Promise<any>;

        format(options: Object): any | Promise<any>;


        toBoolean(): Boolean;

        toTruthy(): Boolean;
    }

    export interface DataFormatterOptions {
        value: any;
        source?: TeamsHandlerStocked;
    }

    // @ts-ignore
    export interface TeamsHandler<ID, anything> extends Map<String, any> {
        constructor(options: TeamsHandlerOptions): this;

        manager?: TeamsManager | null;
        type: TeamsHandlerType | String;
        array: TeamsHandlerStocked[];


        parents: ParentTeam[] | Team[];
        subs: SubTeam[] | Team[];

        keys: String[];
        values: any[];
        entries: Array<Array<String | any>>;


        add(team: AnyTeam): AnyTeam;

        sorted(): Promise<TeamsHandlerStocked>;

        clearAllPoints(recursive: Boolean): Promise<Boolean>;

        find(callback: TeamsHandlerCallback): TeamsHandlerStocked | null;

        filter(callback: TeamsHandlerCallback): TeamsHandler<String, any>;

        map(callback: TeamsHandlerMapCallback): TeamsHandler<String, any>;

        clone(): TeamsHandler<String, any>;

        resolve(resolvable: string): TeamsHandlerStocked;

        toData(): TeamsHandlerOptions;

        toArray(): TeamsHandlerStocked[];
    }

    export interface TeamsHandlerCallback {
        (team: TeamsHandlerStocked): Boolean;
    }

    export interface TeamsHandlerMapCallback {
        (team: TeamsHandlerStocked): any;
    }

    export interface TeamsHandlerOptions {
        base: Array<Array<String | TeamsHandlerStocked>>;
        type: TeamsHandlerType;
        manager: TeamsManager;
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
        color: number | false;
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

    export interface PointsHandler {
        latest: number | null | undefined;

        get(nullable: Boolean): Promise<number | null | DataFormatter>;

        add(points: number): Promise<number>;

        remove(points: number): Promise<number>;

        set(points: number): Promise<number>;

        clear(recursive: Boolean): number;

        checkPoints(returnTeam: Boolean): Promise<this>;
    }

    export interface SubPointsHandler extends PointsHandler {
        parent(): Promise<number>;

        current(): Promise<number>;

        setLocal(points: number): Promise<number>;
    }

    export interface ParentPointsHandler extends PointsHandler {

    }

    type AnyTeam = Team | ParentTeam | SubTeam;
    type TeamsHandlerStocked = AnyTeam | TeamMember | TeamGuild;


    type ParentTeamResolvable = ParentTeamData | ParentTeam;

    type SubTeamResolvable = SubTeamData | SubTeam;

    type BasicTeamResolvable = TeamData | Team;

    type TeamResolvable = ParentTeamResolvable | SubTeamResolvable | BasicTeamResolvable;

    export interface TeamData {
        id: string;
        name?: string;
        aliases?: string[];
        color?: number|false|null;
        role?: string|null;
        guild?: string|null;
    }


    export interface ParentTeamData extends TeamData {
        type?: TeamType;
        subs: TeamResolvable[]
    }

    export interface SubTeamData extends TeamData {
        type?: TeamType;
        parent?: string | ParentTeam
    }

}