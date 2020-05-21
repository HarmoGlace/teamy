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
                        id: 'sub1',
                        roleId: '123456789' // optional, used to detect member role if a client and a guildId are given
                    }
                ]
            },
            {
                id: 'parent2',
                subs: [
                    {
                        id: 'sub2',
                        roleId: '23456789'
                    }
                ]
            }
        ],
    functions: { // Needed. Used to save points, you can use the database that you want, here it is enmap
        setPoints: (team, points) => pointsDB.set(team.id, points),
        getPoints: (team) => pointsDB.get(team.id)
    },
    client,
    guildId: '123456789' // guildId where these teams belong to. It will be used to get roles
});

const sub1 = manager.teams.get('sub1');

sub1.points.add(153);

sub1.points.get() // return 153

sub1.parent // returns parent Team

client.once('ready', () => {
    manager.initialize(); // Optional, set up roles, it will enable the Team#role property. It is not needed to detect a member role
})

client.on('message', message => {
    const team = manager.getMemberTeam(message.member); // returns the member team or null if none is found
})

client.login('secretToken');


const test = {
    setPoints: (team, points) => pointsDB.set(team.id, points),
    getPoints: (team) => pointsDB.get(team.id)
}



