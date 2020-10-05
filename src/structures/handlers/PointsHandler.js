const TeamyError = require("../TeamyError");
const DataFormatter = require("../util/DataFormatter");
const { defineUnlistedProperty } = require('../util/Util');

/**
 * PointsHandler, for a basic {@link Team}
 */

class PointsHandler {

    /**
     * @param {Team} team Team this Handler belong to
     */

    constructor (team) {

        /**
         * Team this PointsHandler belong to
         * @type {Team}
         */

        defineUnlistedProperty('team', team, this);


        /**
         * Latest points recorded. It is false if there is no points recorded and null if the latest points recorded are null
         * @type {Number|null|false}
         */

        this.latest = false;
    }


    #handleGetPoints (data) {

        if (!data && data !== 0) data = nullable ? null : 0;
        if (data) data = Number(data);


        if (Number.isNaN(data) && data !== null) throw new TeamyError(`getPoints function should only return number. Received ${data.constructor.name}`);

        return data;
    }

    /**
     * Get the points of this team
     * @param {Boolean} [nullable=false] Whatever to return null if the provided function returns a falsy value (excepted 0)
     * @returns {number|null|Promise<number|null>|DataFormatter<Promise<number>|null>} The points of the team
     */

    get (nullable = false, forceRaw = false) {
        const returned = this.team.manager.functions.getPoints(this.team);


        const found = returned instanceof Promise ? new Promise((async (resolve, reject) => {
            const data = await returned
                const resolved = this.#handleGetPoints(data);
                this.latest = resolved;

                resolve(resolved);
        })) : this.#handleGetPoints(returned);

        if (!(found instanceof Promise)) this.latest = found;

        return this.team.manager.functions.formatPoints && !forceRaw ? new DataFormatter(this.team.manager, { value: found, source: this.team }) : found;
    }

    /**
     * Add points to the team
     * @param {number} points Points to add
     * @returns {number|Promise<Number>} New team points
     */

    async add (points) {

        const found = this.get(null, true);

        if (found instanceof Promise) {
            return new Promise(((resolve, reject) => {
                found.then(data => {
                    resolve(this.set(data + points));
                })
            }))
        }

        return this.set(found + points);
    }

    /**
     * Remove points to the team
     * @param {number} points Points to remove
     * @returns {number|Promise<Number>} New team points
     */

    remove (points) {
        return this.add(-points);
    }

    /**
     * Set points to this team
     * @param {Number} points Points to set
     * @param othersArgs others args that will be given when executing the set points function.
     * @returns {number|Promise<Number>} New team points
     */

    set (points, ...othersArgs) {
        if (Number.isNaN(points)) throw new TeamyError(`Expected a Number, found ${points.constructor.name}`);

        const set = this.team.manager.functions.setPoints(this.team, points, ...othersArgs);

        if (set instanceof Promise) {
            return new Promise(((resolve, reject) => {
                set.then(data => {
                    resolve(this.get());
                })
            }))
        }

        return this.get();
    }

    /**
     * Check the points of the team to update the `latest` property
     * @return {PointsHandler|Promise<PointsHandler>}
     */

    checkPoints () {
        this.get(true, true);

        return this;
    }

    /**
     *  Clear (reset) the points of this team. Use this carefully
     * @param [recursive=true] Whatever also delete points of members who belongs to this team, if there are.
     * @param othersArgs Others args that will be passed to the set function
     * @returns {number|Promise<Number>} New team points (should be 0)
     */

    clear (recursive = true, ...othersArgs) {

        const set = this.set(0, ...othersArgs);

        if (!recursive || !this.members?.enabled) return set;

        const members = this.members.fetch();

        function clearMembers (members) {
            for (const member of members.toArray()) {
                member.points.clear();
            }
        }

        if (members instanceof Promise) {
            return new Promise(((resolve) => {
                members.then(data => {
                    clearMembers(data);
                    resolve(set);
                })
            }))
        } else {
            clearMembers(members);
        }



        return set;
    }
}

module.exports = PointsHandler;