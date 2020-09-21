const { TeamsManager, TeamsHandler } = require('../src/index');

const { Client } = require('discord.js');
const Enmap = require('enmap');
const databases = {
    sub: new Enmap({ name: 'subs' }),
    parent: new Enmap({ name: 'parents' }),
    member: new Enmap({ name: 'users' })
}

const config = require('./config');

const manager = new TeamsManager({
    type: 'advanced',
    teams: [
        {
            id: 'parent1',
            subs: [
                {
                    id: 'sub1',
                    roleId: '754644003961700382' // optional, used to detect member role if a client and a guildId are given
                }
            ]
        },
        {
            id: 'parent2',
            subs: [
                {
                    id: 'sub2',
                    roleId: '754681447532593202'
                }
            ]
        }
    ],
    functions: { // Needed. Used to save points, you can use the database that you want, here it is enmap
        setPoints: async (team, points) => databases[team.type].set(team.id, points, 'points'),
        getPoints: async (team) => databases[team.type].has(team.id) ? databases[team.type].get(team.id, 'points') : null,


        // Optional
        // Used to know the GuildMember team. Should return a Team or a SubTeam for advanced managers
        // getMemberTeam: (member, teams) => teams.find(team => member.roles.cache.has(team.roleId)),



        getSavedMemberTeam: (member, teams) => databases.member.has(member.id) ? databases.member.get(member.id, 'team') : null,
        setMemberTeam: (team, member) => databases.member.set(member.id, team.id, 'team'),



        getTeamMembers: (team) => databases.find(user => user.team === team.id)
    },
    guildId: '123456789', // guildId where these teams belong to. It will be used to get roles
    implementMember: true
});

const client = new Client();

manager.setClient(client);

const sub1 = manager.get('sub1');
// console.log(sub1.name)

// sub1.points.set(50).then(console.log);


// manager.get('sub2').points.set(432).then(console.log)

// console.log((await manager.sorted()))

// const sorted = manager.subs.sorted().then(console.log);
// console.log(sorted)


const iterated = manager.parents;

// console.log(iterated, iterated.next(), iterated.next())

for (const team of iterated) {
    console.log(team)
}

// console.log(manager.toString())

// sub1.parent // returns parent Team

client.once('ready', () => {
    manager.initialize(); // Optional, set up roles, it will enable the Team#role property. It is not needed to detect a member role
    console.log(`Ready on ${client.user.username}`)
})
//
// client.on('message', async message => {
//
//     const member = message.member;
//
//     member.points.clear();
//
//     // console.log(member)
//
//     const points = await member.points.get();
//
//     const newPoints = await member.points.add(12);
//
//     console.log(newPoints);
//
//
// })

client.login(config.token);


// console.log(new TeamsHandler().set('test', '1'));
//
// console.log(manager.subs,);



