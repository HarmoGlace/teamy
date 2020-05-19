const TeamyError = require('../TeamyError');
const Team = require('./Team');
const ParentTeam = require('./ParentTeam');
const SubTeam = require('./SubTeam');

class TeamsManager {
    constructor({
            client = null,
            teams = [],
            type = 'basic',
            functions: {
                setPoints ,
                getPoints
            } = {}
                } = {}) {

            if (client) this.client = client;

            if (!setPoints || !getPoints || typeof setPoints !== 'function' || typeof getPoints !== 'function') throw new TeamyError(`Please provide setPoints and getPoints functions`);
            if (!(teams instanceof Array)) throw new TeamyError(`Paramater teams should be an array, received ${typeof teams}`);

            this.teams = [];

            this.type = type;

            if (type === 'basic') {
                for (const team of teams) {
                    if (typeof team !== 'object' || team instanceof Array) throw new TeamyError(`Paramater teams should be an array of objects, instead received an array of ${typeof team === 'object' ? 'array' : typeof team}`);
                    if (this.teams.find(team => team.id === parent.id)) throw new TeamyError(`Duplicated team with id ${team.id}`);

                    this.teams.push(new Team(this, team));
                }
            } else if (type === 'advanced') {

                for (const parent of teams) {
                    if (typeof parent !== 'object' || parent instanceof Array) throw new TeamyError(`Paramater teams should be an array of objects, instead received an array of ${typeof parent === 'object' ? 'array' : typeof parent}`);
                    if (this.teams.find(team => team.id === parent.id)) throw new TeamyError(`Duplicated Parent team with id ${parent.id}`);

                    const parentTeam = new ParentTeam(this, parent);

                    const subs = parent.subs.slice();

                    for (const sub of subs) {
                        if (typeof sub !== 'object' || sub instanceof Array) throw new TeamyError(`Paramater teams should be an array of objects, instead received an array of ${typeof sub === 'object' ? 'array' : typeof sub}`);

                        if (this.teams.filter(team => team.type === 'sub').find(team => team.id === sub.id)) throw new TeamyError(`Duplicated Sub team with id ${sub.id}`);

                        const subTeam = new SubTeam(this, sub);

                        this.teams.push(subTeam);
                        parentTeam.subs.push(subTeam);
                    }

                    console.log(parentTeam)

                    this.teams.push(parentTeam);
                }

            } else {
                throw new TeamyError(`TeamsManager type must be basic or advanced. Instead type was ${type}`);
            }



    }
}

module.exports = TeamsManager;