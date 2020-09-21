const TeamsHandler = require('./TeamsHandler');

class ParentTeamsHandler extends TeamsHandler {
    constructor ({
                     base,
                     manager,
                     type,
                     parent
                 }) {
        super(base);

    }
}

module.exports = ParentTeamsHandler;