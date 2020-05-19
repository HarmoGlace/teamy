const Team = require('./Team');

class SubTeam extends Team {
    constructor(manager, options) {
        super(manager, options);

        this.type = 'sub';


    }
}

module.exports = SubTeam;