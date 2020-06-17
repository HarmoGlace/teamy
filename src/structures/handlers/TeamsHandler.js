const TeamyError = require('../TeamyError');
const Team = require('../team/Team');
const ParentTeam = require('../team/ParentTeam');
const SubTeam = require('../team/SubTeam');


/**
 * Teams Handler used by the TeamsManager class
 * @extends Map
 */

class TeamsHandler extends Map {

    /**
     *
     * @param {TeamsManager} manager TeamsManager this TeamsHandler belong to
     */

    constructor(manager) {
        super();

        this.manager = manager;
    }

    /**
     * Add a Team to this TeamsManager
     * @param {TeamResolvable} team Team to add
     * @returns {SubTeam|ParentTeam|Team}
     */

    add(team) {

        if (typeof team !== 'object' || team instanceof Array) throw new TeamyError(`You need to specify an object`)
        if (this.get(team.id)) throw new TeamyError(`There is already a team with id ${team.id}`);

        if (this.manager.type === 'basic') {

            const teamCreated = new Team(this.manager, team)

            this.set(teamCreated.id, teamCreated);

            return teamCreated;

        } else if (this.manager.type === 'advanced') {

            if (!team.hasOwnProperty('type')) {
                if (team.subs) team.type = 'parent'
                else team.type = 'sub'
            }

            if (team.type === 'parent') {
                if (!team.hasOwnProperty('subs')) {
                    process.emitWarning(`You didn't provide any sub teams for the ${team.id} team`);
                    team.subs = [];
                }

                const parentTeam = new ParentTeam(this.manager, team);

                const subs = team.subs.slice();

                for (const sub of subs) {
                    if (typeof sub !== 'object' || sub instanceof Array) throw new TeamyError(`Parameter teams should be an array of objects, instead received an array of ${sub.constructor.name}`);

                    if (this.get(sub.id)) throw new TeamyError(`Duplicated (Sub) team with id ${sub.id}`);

                    const subTeam = new SubTeam(this.manager, sub, parentTeam);

                    this.all.push(subTeam);
                    parentTeam.subs.push(subTeam);
                }

                this.set(parentTeam.id, parentTeam);

                return parentTeam;

            } else if (team.type === 'sub') {

                const parentRaw = team.parentId || team.parent;

                if (!parent) throw new TeamyError(`No ParentTeam provided for ${team.id} SubTeam`);

                const parent = parentRaw instanceof ParentTeam ? parentRaw : this.all.get(parentRaw);

                if (!parent) throw new TeamyError(`Cannot find a ParentTeam for ${team.id} SubTeam`);

                const subTeam = new SubTeam(this.manager, team, parent);

                this.set(subTeam.id, subTeam);
                parent.subs = parent.subs.push(subTeam);

                return subTeam;

            }


        }

        if (this.manager.initialized) this.manager.initialize();

    }

    /**
     * Remove a teams from this TeamsManager
     * @param {TeamResolvable} team Team to remove
     * @returns {Team[]|Array<ParentTeam|SubTeam>}
     */

    remove(teamRaw) {

        if (!teamRaw || !(teamRaw instanceof Team) || !this.get(teamRaw.id)) throw new TeamyError(`You need to provide a valid Team to delete`);

        this.delete(teamRaw.id);

        return this;

    }

    /**
     * Remove all teams to keep have given teams
     * @param {Team|ParentTeam|SubTeam} teams Teams to keep
     * @returns {Team[]|Array<ParentTeam|SubTeam>}
     */

    set(teams) {
        if (!(teams instanceof Array)) throw new TeamyError(`You must specify an array in <TeamsManager>.teams.set, instead received ${teams.constructor.name})`);

        this.clear();

        for (const team of teams) {
            this.set(team.id, team);
        }

        return this.all;


    }

    /**
     * All ParentTeam of this TeamsHandler
     * @returns {ParentTeam[]}
     */

    parents() {
        return this.toArray().filter(team => team.type === 'parent');
    }

    /**
     * All SubTeam of this TeamsHandler
     * @returns {SubTeam[]}
     */

    subs() {
        return this.toArray().filter(team => team.type === 'sub');
    }

    /**
     * Teams sorted by their points
     * @returns {Team[]|ParentTeam[]}
     */

    sorted () {
        if (this.manager.type === 'basic') return this.toArray().sort((a, b) => b.points.get() - a.points.get());

        const parents = this.parents();

        for (const parent of parents) {
            parent.subs.sort((a, b) => b.points.get() - a.points.get());
        }

        return parents.sort((a, b) => b.points.get() - a.points.get());
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

    find(findFunction) {
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

    /**
     * Convert this TeamsHandler to an Array
     * @return {Team[]|Array<ParentTeam|SubTeam>}
     */

    toArray () {
        return Array.from(this.values());
    }
}

module.exports = TeamsHandler;