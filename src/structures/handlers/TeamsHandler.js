const TeamyError = require('../TeamyError');
const Team = require('../team/Team');
const ParentTeam = require('../team/ParentTeam');
const SubTeam = require('../team/SubTeam');


/**
 * Teams Handler used by the TeamsManager class
 */

class TeamsHandler {

    /**
     *
     * @param {TeamsManager} manager TeamsManager this TeamsHandler belong to
     */

    constructor(manager) {
        this.manager = manager;

        this.all = [];
    }

    add(team) {

        if (typeof team !== 'object' || team instanceof Array) throw new TeamyError(`You need to specify an object in <TeamsManager>.teams.add`)
        if (this.get(team.id)) throw new TeamyError(`There is already a team with id ${team.id}`);

        if (this.manager.type === 'basic') {

            const teamCreated = new Team(this.manager, team)

            this.all.push(teamCreated);

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

                this.all.push(parentTeam);

                return parentTeam;

            } else if (team.type === 'sub') {

                const parentRaw = team.parentId || team.parent;

                if (!parent) throw new TeamyError(`No ParentTeam provided for ${team.id} SubTeam`);

                const parent = parentRaw instanceof ParentTeam ? parentRaw : this.all.get(parentRaw);

                if (!parent) throw new TeamyError(`Cannot find a ParentTeam for ${team.id} SubTeam`);

                const subTeam = new SubTeam(this.manager, team, parent);

                this.all.push(subTeam);
                parent.subs = parent.subs.push(subTeam);

                return subTeam;

            }


        }

        if (this.manager.initialized) this.manager.initialize();

    }

    remove(teamRaw) {

        if (!teamRaw || !(teamRaw instanceof Team)) throw new TeamyError(`You need to provide a valid Team to delete`);

        const team = this.get(teamRaw.id);
        const index = this.all.indexOf(team);

        this.all.splice(index, 1);

        return this.all;

    }

    set(teams) {
        if (!(teams instanceof Array)) throw new TeamyError(`You must specify an array in <TeamsManager>.teams.set, instead received ${teams.constructor.name})`);

        this.all = [];

        for (const team of teams) {
            this.add(team);
        }

        return this.all;


    }



    get parents() {
        return this.all.filter(team => team.type && team.type === 'parent');
    }

    get subs() {
        return this.all.filter(team => team.type && team.type === 'sub');
    }


    get sorted() {
        if (this.manager.type === 'basic') return this.all.sort((a, b) => b.points.get() - a.points.get());

        const parents = this.parents;

        for (const parent of parents) {
            parent.subs.sort((a, b) => b.points.get() - a.points.get());
        }

        return parents.sort((a, b) => b.points.get() - a.points.get());
    }

    find(findFunction) {
        return this.all.find(findFunction) || null;
    }

    get(id) {
        return this.find(team => team.id === id);
    }

    resolve(resolvable) {
        resolvable = resolvable.toLowerCase();
        return this.all.find(team => team.name.toLowerCase() === resolvable || team.id.toLowerCase() === resolvable || team.aliases.includes(resolvable)) || this.all.find(team => resolvable.startsWith(team.name.toLowerCase()) || resolvable.startsWith(team.id.toLowerCase())) || null;
    }
}