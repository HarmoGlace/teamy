class Team {
    constructor(manager, {
        id,
        name = id,
        aliases = [],
        color = 0x000000,
        database = manager.database,
        roleId = null
    } = {}) {
        this.manager = manager;

        this.database = database;

        this.id = id;
        this.name = name;
        this.aliases = aliases;
        this.color = color;

        if (roleId) this.roleId = roleId;

        if (manager.type === 'basic') {

            this.points = {
                get: () => {
                    return manager.functions.getPoints(this);
                },
                add: (points) => {
                    return this.points.set(this.points.get() + points);
                },
                remove: (points) => {
                    return this.points.set(this.points.get() - points);
                },
                set: (points) => {
                    return manager.functions.setPoints(this, points);
                }
            };

        }

    }
}

module.exports = Team;