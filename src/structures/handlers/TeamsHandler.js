class TeamsHandler extends Map {

    /**
     * Initializes this TeamsHandler
     * @param base
     * @param manager
     * @param type
     */

    constructor (base, manager = null, type = null) {
        super(base);
        this.manager = manager;
        this.type = type || manager && manager.type === 'advanced' ? 'all' : 'normal' || 'unknown';
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

    async sorted () {
        const sortTeams = async (teams) => {
            const elements = await Promise.all(teams.map(async team => await team.points.checkPoints(true)));

            return elements.sort((a, b) => b.points.latest - a.points.latest);
        }

        if (['normal', 'subs'].includes(this.type)) return sortTeams(this.toArray());


        const parents = this.toArray().filter(team => team.type === 'parent');

        for (const parent of parents) {
            parent.subs = await sortTeams(parent.subs);
        }

        return sortTeams(parents);
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
        resolvable = resolvable.toString().toLowerCase();
        return this.find(team => team.name.toLowerCase() === resolvable || team.id.toLowerCase() === resolvable || team.aliases.includes(resolvable)) || this.find(team => resolvable.startsWith(team.name.toLowerCase()) || resolvable.startsWith(team.id.toLowerCase())) || null;
    }

    set (...args) {
        return super.set(...args);
    }

    get keys () {
        return [...super.keys()];
    }

    /**
     * Convert this TeamsManager to an Array
     * @return {Team[]|Array<ParentTeam|SubTeam>}
     */

    toArray () {
        return [...super.values()];
    }

    toString () {
        return this.keys.join(', ');
    }


    * [Symbol.iterator] () {
        yield super.values();
    }



}

module.exports = TeamsHandler;