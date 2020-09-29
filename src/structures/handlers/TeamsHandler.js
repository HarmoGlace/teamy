const { defineUnlistedProperty } = require('../util/Util');

/**
 * TeamsHandler
 */

class TeamsHandler extends Map {


    #manager

    /**
     * Initializes this TeamsHandler
     * @param {Object} options
     * @param {Array<Array<String, *>>} [options.base=[]]
     * @param {TeamsManager} options.manager
     * @param {String} [options.type='unknown']
     */

    constructor ({
                     base = [],
                     manager = null,
                     type = 'unknown'
                 }) {
        super(base);

        defineUnlistedProperty('_constructed', this.constructor, this);

        this.#manager = manager;

        defineUnlistedProperty('type', type, this);
    }

    get manager () {
        return this.#manager
    }

    set manager (newValue) {
        return this.#manager = newValue;
    }

    /**
     * All ParentTeam of this TeamsHandler
     * @type {TeamsHandler<ParentTeam>}
     */

    get parents () {
        return this.type === 'basic' ? this : this.filter(team => team.type === 'parent', 'parents');
    }

    /**
     * All SubTeam of this TeamsHandler
     * @type {TeamsHandler<SubTeam>}
     */

    get subs () {
        return this.type === 'basic' ? this : this.filter(team => team.type === 'sub', 'subs');
    }

    /**
     * Gets a Team with its id
     * @param {String} id Team Id
     * @returns {Team|SubTeam|ParentTeam|null} the team or null if none was found
     */

    get (id) {
        return super.get(id) || null;
    }

    /**
     * Teams sorted by their points
     * @returns {Team[]|ParentTeam[]|*}
     */

    async sorted () {

        const sortTeams = async (teams) => {
            const elements = await Promise.all(teams.map(async team => {
                if (team.type === 'parent') await sortTeams(team.subs)
                return (await team.points.checkPoints(true)).team;
            }));

            return elements.sort((a, b) => b.points.latest - a.points.latest);
        }

        return sortTeams(this.toArray());

    }

    /**
     * Clear points of all teams
     * @param [recursive=true] Whatever enable recursively when using the clear method on all teams of these Teams
     * @return {boolean} successful Return true if successful
     */

    clearAllPoints (recursive = true) {

        for (const team of this.toArray()) {
            team.points.clear(recursive);
        }

        return true;
    }

    /**
     * Find a team with a function. Same as [Array#find](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/find)
     * @param {function} findFunction Function passed to find a team
     * @returns {TeamsHandler<Team|ParentTeam|SubTeam>|null|*}
     */

    find (findFunction) {
        return this.toArray().find(findFunction) || null;
    }


    /**
     * Filter teams with a function. Same as [Array#filter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/filter)
     * @param {function} filterFunction Function passed to filter the teams
     * @param {String} type The type of the new TeamsHandler
     * @return {TeamsHandler<Team|ParentTeam|SubTeam|TeamMember>|null|*}
     */

    filter (filterFunction, type = 'custom') {
        return new this._constructed(
            {
                base: this.toArray().filter(filterFunction).map(team => [ team.id, team ]),
                type,
                manager: this.manager
            });
    }


    /**
     * Resolve a team with a string
     * @param {String} resolvable
     * @returns {Team|ParentTeam|SubTeam|null|*}
     */

    resolve (resolvable) {
        resolvable = resolvable.toString().toLowerCase();
        return this.find(team => team.name.toLowerCase() === resolvable || team.id.toLowerCase() === resolvable || team.aliases.includes(resolvable)) || this.find(team => resolvable.startsWith(team.name.toLowerCase()) || resolvable.startsWith(team.id.toLowerCase())) || null;
    }

    /**
     * Maps the TeamsHandler with a function. Same as [Array#map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/map)
     * @returns TeamsHandler<String, *>
     */

    map (mapFunction, ...globalArgs) {
        return  new this._constructed({
            base: this.entries.map(([id, team], ...args) => [ id, mapFunction(team, ...args) ], ...globalArgs),
            type: 'custom',
            manager: this.manager
        })
    }

    /**
     * Add a Team to this TeamsManager
     * @param {Team|ParentTeam|SubTeam} team The team to add
     * @return {*}
     */

    add (team) {
        return this.set(team.id, team);
    }

    set (...args) {
        return super.set(...args);
    }

    get keys () {
        return [ ...super.keys() ];
    }

    get values () {
        return [ ...super.values() ];
    }

    get entries () {
        return [ ...super.entries() ];
    }

    /**
     * Convert this TeamsManager to an Array
     * @return {Team[]|Array<ParentTeam|SubTeam>|Array<*>}
     */

    toArray () {
        return this.values;
    }

    /**
     * Runs a function for each team in this TeamsHandler
     * @param {function} callback The callback used
     */

    forEach (callback) {
        return this.toArray().forEach(callback);
    }

    toString () {
        return this.keys.join(', ');
    }


}

module.exports = TeamsHandler;