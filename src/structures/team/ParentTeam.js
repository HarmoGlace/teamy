const Team = require('./Team');

class ParentTeam extends Team {
    constructor(manager, options) {
        super(manager, options);

        this.type = 'parent';
        this.subs = [];
    }
}

module.exports = ParentTeam;