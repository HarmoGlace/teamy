const Team = require('./Team');
const TeamsHandler = require('../handlers/TeamsHandler');
const ParentPointsHandler = require('../handlers/ParentPointsHandler');

/**
 * A Parent Team. Extends {@link Team}
 * @extends Team
 */

class ParentTeam extends Team {

    /**
     *
     * @param {TeamsManager} manager TeamsManager this ParentTeam belong to
     * @param {TeamData} data The data for this team
     */

    constructor (manager, data) {
        super(manager, { ...data, type: 'parent' });

        /**
         * The type of this team. Should be `parent`
         * @constant
         * @type {String}
         * @enum {TeamType}
         */

        this.type = 'parent';

        /**
         * Points of this team
         */

        this.points = new ParentPointsHandler(this);

    }

    /**
     * Get the SubTeams of this ParentTeam
     * @type {TeamsHandler}
     */

    get subs () {
        return new TeamsHandler({
            base: this.manager.subs.toArray().filter(team => team.parent.id === this.id).sort((a, b) => b.points.latest - a.points.latest).map(team => [ team.id, team ]),
            manager: this.manager,
            type: 'subs'
        });
    }

    delete () {

        for (const sub of this.subs.toArray()) {
            sub.delete();
        }

        return super.delete();
    }
}

module.exports = ParentTeam;