import {TeamsManager} from 'teamy';

const manager: TeamsManager = new TeamsManager({
    functions: {
        setPoints: (team, points) => console.log,
        getPoints: () => 0
    }
});