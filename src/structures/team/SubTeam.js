const Team = require('./Team');

class SubTeam extends Team {
    constructor(manager, options, parent) {
        super(manager, options);

        this.type = 'sub';
        this.parent = parent;

        this.points = {
            parent: () => {
                return this.parent.points.get() || 0;
            },
            current: () => {
                return manager.functions.getPoints(this) || 0;
            },
            get: this.points.current,
            add: (points) => {
                this.parent.points.add(points);
                return this.points.setLocal(this.points.current() + points);
            },
            remove: (points) => {
                this.parent.points.remove(points);
                return this.points.setLocal(this.points.current() - points);
            },
            set: (points) => {
                const diff = points - this.points.current();
                this.parent.points.add(diff);
                return manager.functions.setPoints(this, points);
            },
            setLocal: (points) => {
                return manager.functions.setPoints(this, points);
            }

        }
    }
}

module.exports = SubTeam;