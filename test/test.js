const { TeamsManager } = require('../src/index');
const { Client } = require('discord.js');
const client = new Client();
const Enmap = require('enmap');
const pointsDB = new Enmap({name: 'points'});

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
        setPoints: (team, points) => pointsDB.set(team.id, points),
        getPoints: (team) => pointsDB.get(team.id)
    },
    client
});

const sub1 = manager.teams.get('sub1');

sub1.points.add(153);

