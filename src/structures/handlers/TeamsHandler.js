const TeamyError = require("../util/TeamyError");
const { defineUnlistedProperty } = require('../util/Util');

/**
 * TeamsHandler. Extends native [Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Map)
 * @extends [Map]
 */

class TeamsHandler extends Map {


    #manager

    /**
     * Initializes this TeamsHandler
     * @param {Object} options
     * @param {Array<Array<String, *>>} [options.base=[]]
     * @param {TeamsManager} [options.manager]
     * @param {String} [options.type='unknown']
     */

    constructor ({
                     base = [],
                     manager = null,
                     type = 'unknown'
                 }) {

        if (!base.every(data => Array.isArray(data) && data.length >= 2 && typeof data[0] === 'string')) throw new TeamyError(`TeamsHandler constructor base option: please provide a Array<Array<String, *>>`)

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
     * Get the number of items in this TeamsHandler
     * @return {number}
     */

    get length () {
        return super.size;
    }

    /**
     * Get all the types of data stored here
     * @type {Array<*>}
     */

    get types () {
        return [ ...new Set(this.toArray().map(team => team?.type || team?.constructor?.name || typeof team)) ];
    }

    /**
     * Convert this TeamsHandler to an array
     * @type {Team[]|Array<ParentTeam|SubTeam>|Array<*>}
     */

    get array () {
        return this.toArray();
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
     * See if a Team belongs to this TeamsHandler, with its id
     * @param {String} id Team Id
     * @return {boolean}
     */

    has (id) {
        return super.has(id);
    }

    /**
     * Removes a Team here with its Id
     * @param {String} id Team id
     * @returns {Boolean}
     */

    remove (id) {
        return super.delete(id);
    }

    /**
     * Teams sorted by their points
     * @returns {Team[]|ParentTeam[]|*}
     */

    async sorted () {

        const sortTeams = async (teams) => {
            const elements = await Promise.all(teams.map(async team => {
                if (team.type === 'parent') await sortTeams(team.subs.toArray());
                return (await team.points.checkPoints(true)).team;
            }));

            return elements.sort((a, b) => b?.points?.latest - a?.points?.latest);
        }

        return sortTeams(this.toArray());

    }

    /**
     * Clears all Teams belonging to this TeamsHandler
     * @returns {Boolean} success
     */

    clear () {
        return !!super.clear();
    }

    /**
     * Clear points of all teams
     * @param [recursive=true] Whatever enable recursively when using the clear method on all teams of these Teams
     * @returns {boolean} successful Return true if successful
     */

    clearAllPoints (recursive = true) {

        for (const team of this.toArray()) {
            team.points.clear(recursive);
        }

        return true;
    }

    /**
     * Find a team with a function. Same as [Array#find](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/find)
     * @returns {TeamsHandler<Team|ParentTeam|SubTeam>|null|*}
     */

    find (...args) {
        return this.toArray().find(...args) || null;
    }


    /**
     * Filter teams with a function. Same as [Array#filter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/filter)
     * @param {function} filterFunction Function passed to filter the teams
     * @param {String|null} type The type of the new TeamsHandler
     * @param othersArgs Others [Array#filter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/filter) args
     * @return {TeamsHandler<Team|ParentTeam|SubTeam|TeamMember>|null|*}
     */

    filter (filterFunction, type = 'custom', ...othersArgs) {
        return new this._constructed(
            {
                base: this.toArray().filter(filterFunction, ...othersArgs).map(team => [ team.id, team ]),
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
        return new this._constructed({
            base: this.entries.map(([ id, team ], ...args) => [ id, mapFunction(team, ...args) ], ...globalArgs),
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

    /**
     * Sets a team
     * @param {String} key The key of the value to set
     * @param {*} value The value of the key to set
     * @return {Map}
     */

    set (id, value) {

        if (typeof id !== 'string') throw new TeamyError(`TeamsHandler#set should only receive a String as first argument. Instead received ${id?.constructor?.name || typeof id}`)

        return super.set(id, value);
    }

    /**
     * Clones this TeamsHandler
     * @return {TeamsHandler<String, Team|SubTeam|ParentTeam|TeamMember|TeamGuild|*>}
     */

    clone () {
        return new this._constructed(this.toData());
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
     * Convert this TeamsHandler to an Array
     * @return {Team[]|Array<ParentTeam|SubTeam>|Array<*>}
     */

    toArray () {
        return this.values;
    }

    /**
     * Get all the data of this TeamsHandler. Used to create a new TeamsHandler
     * @return {Object} TeamsHandlerData
     */

    toData () {
        return {
            base: this.entries,
            type: this.type,
            manager: this.manager
        }
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
