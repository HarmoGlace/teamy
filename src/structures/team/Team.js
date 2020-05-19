class Team {
    constructor(manager, {
        id,
        name = id,
        aliases = [],
        color = 0x000000,
        roleId = null
    } = {}) {
        this.manager = manager;

        this.id = id;
        this.name = name;
        this.aliases = aliases;
        this.color = color;

        if (roleId) this.roleId = roleId;

            this.points = {
                get: () => {
                    return manager.functions.getPoints(this) || 0;
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

module.exports = Team;