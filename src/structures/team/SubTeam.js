const Team = require('./Team');
const SubPointsHandler = require('../handlers/SubPointsHandler');

/**
 * A SubTeam. Extends {@link Team}
 * @extends Team
 */

class SubTeam extends Team {

    /**
     *
     * @param {TeamsManager} manager TeamsManager this SubTeam belong to
     * @param {TeamData} data Data for this SubTeam
     * @param {ParentTeam} parent Parent team of this SubTeam
     */

    constructor (manager, data, parent) {
        super(manager, { ...data, type: 'sub' });

        /**
         * The type of this team. Should be `sub`
         * @constant
         * @type {TeamType}
         * @enum {TeamType}
         */

        this.type = 'sub';

        /**
         * ParentTeam of this team
         * @type {ParentTeam}
         */

        this.parent = parent;

        /**
         * Points Handler of this team
         * @type {SubPointsHandler}
         */

        this.points = new SubPointsHandler(this);

    }

    toData () {
        return {
            ...super.toData(),
            parent: this.parent
        }
    }


}

module.exports = SubTeam;