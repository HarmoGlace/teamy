class TeamsHandler extends Map {

    /**
     * Initializes this TeamsHandler
     * @param base
     */

    constructor (base) {
        super(base);
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
     * @returns {Team[]|ParentTeam[]}
     */

    sorted () {
        return this.toArray().sort((a, b) => b.points.get() - a.points.get());
    }

    /**
     * Clear points of all teams
     * @return {boolean} successful Return true if successful
     */

    clearAllPoints () {

        for (const team of this.toArray()) {
            team.points.clear();
        }

        return true;
    }

    /**
     * Find a team with a function
     * @param {function} findFunction function passed to find a team
     * @returns {Team|ParentTeam|SubTeam|null}
     */

    find (findFunction) {
        return this.toArray().find(findFunction) || null;
    }


    /**
     * Resolve a team with a string
     * @param {String} resolvable
     * @returns {Team|ParentTeam|SubTeam|null}
     */

    resolve (resolvable) {
        resolvable = resolvable.toLowerCase();
        return this.find(team => team.name.toLowerCase() === resolvable || team.id.toLowerCase() === resolvable || team.aliases.includes(resolvable)) || this.find(team => resolvable.startsWith(team.name.toLowerCase()) || resolvable.startsWith(team.id.toLowerCase())) || null;
    }

    set (...args) {
        return super.set(...args);
    }

    /**
     * Convert this TeamsManager to an Array
     * @return {Team[]|Array<ParentTeam|SubTeam>}
     */

    toArray () {
        return [...super.values()];
    }

}

module.exports = TeamsHandler;