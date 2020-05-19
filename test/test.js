const { TeamsManager } = require('../src/index');
const { Client } = require('discord.js');
const client = new Client();

const manager = new TeamsManager({
    type: 'advanced',
    teams: [
            {
                id: 'parent1',
                subs: [
                    {
                        id: 'sub1'
                    }
                ]
            },
            {
                id: 'parent2',
                subs: [
                    {
                        id: 'sub2'
                    }
                ]
            }
        ],
    functions: {
        setPoints: (team, points) => 0,
        getPoints: (team) => 0
    }
});

console.log(manager.teams, manager.teams.length, manager.teams.filter(team => team.type === 'sub'), manager.teams.filter(team => team.type === 'parent'));