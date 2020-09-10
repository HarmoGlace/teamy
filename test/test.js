const { TeamsManager, TeamsHandler } = require('../src/index');
const { Client } = require('discord.js');
const Enmap = require('enmap');
const subs = new Enmap({ name: 'subs' });
const parents = new Enmap({ name: 'parents' });
const config = require('./config');

const manager = new TeamsManager({
    type: 'advanced',
    teams: [
        {
            id: 'parent1',
            subs: [
                {
                    id: 'sub1',
                    roleId: '577899952244523028' // optional, used to detect member role if a client and a guildId are given
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
        setPoints: async (team, points) => (team.type === 'parent' ? parents : subs).set(team.id, points),
        getPoints: async (team) => (team.type === 'parent' ? parents : subs).get(team.id)
    },
    guildId: '123456789', // guildId where these teams belong to. It will be used to get roles
    implementMember: true
});

const client = new Client();

manager.setClient(client);

const sub1 = manager.get('sub1');
// console.log(sub1.name)

sub1.points.set(50).then(console.log);


manager.get('sub2').points.set(432).then(console.log)

// console.log((await manager.sorted()))

const sorted = manager.sorted().then(console.log);

// console.log(sorted)

console.log(manager.toString())

sub1.parent // returns parent Team

client.once('ready', () => {
    manager.initialize(); // Optional, set up roles, it will enable the Team#role property. It is not needed to detect a member role
})

client.on('message', message => {
    console.log(message.member.teams, message.member.team) // returns the member team or null if none is found
})

client.login(config.token);


const test = {
    setPoints: (team, points) => pointsDB.set(team.id, points),
    getPoints: (team) => pointsDB.get(team.id)
}

// console.log(new TeamsHandler().set('test', '1'));
//
// console.log(manager.subs,);



