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
                    return this.database.get(id, 'points')
                },
                add: (points) => {
                    return this.points.set(this.points.get() + points);
                },
                remove: (points) => {
                    return this.points.set(this.points.get() - points);
                },
                set: (points) => {
                    return this.database.set(id, points, 'points');
                }
            };

        }

    }
}

module.exports = Team;