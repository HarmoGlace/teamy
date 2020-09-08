class TeamyError extends Error {
    constructor (message) {
        super(message);
        this.name = 'TeamyError';
        Error.captureStackTrace(this, TeamyError);
    }
}

module.exports = TeamyError;