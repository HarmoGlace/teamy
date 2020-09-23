const { TeamsManager, TeamsHandler } = require('teamy');

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
        getMemberTeam: (member, teams) => {
            const found = teams.find(team => member.roles.cache.has(team.roleId)) || null;

            const saved = databases.member.has(member.id) ? databases.member.get(member.id, 'team') : null;

            if (found?.id !== saved) databases.member.set(member.id, found?.id || null, 'team');

            return found;
        },


        getTeamMembers: (team) => databases.member.filter(user => user.team === team.id).keyArray().map(member => team.manager.teamsGuild.members.fetch(member))
    },
    guildId: '718743854496612406', // guildId where these teams belong to. It will be used to get roles
    implementMember: true
});

const client = new Client();

manager.client = client;

const { Structures } = require('discord.js');

console.log(Structures.get('GuildMember'));

const sub1 = manager.get('sub1');
// console.log(sub1.name)

// sub1.points.set(50).then(console.log);


// manager.get('sub2').points.set(432).then(console.log)

// console.log((await manager.sorted()))

// const sorted = manager.subs.sorted().then(console.log);
// console.log(sorted)


const subs = manager.subs;

// console.log(subs, subs.toArray());





// console.log(iterated[Symbol.iterator].next())

// console.log(iterated, iterated[Symbol.iterator])
//
// console.log(iterated[Symbol.iterator]())
// for (const team of iterated) {
//     console.log('team lol ', team)
// }

// const handler = new TeamsHandler({ base: [[ 'a', 'okboomer' ], [' b ', 'derien'], ['c', 'ptdrtki']] });

// console.log(handler);
//
// for (const team of handler) {
//     console.log(team)
// }


// console.log(manager, '  toArray: ', manager.toArray(), '')
//
//
// console.log('lol')
//
// console.log(manager.get('parent1'))

// console.log(iterated, iterated.get('parent1'))

// for (const team of iterated) {
//     console.log(team)
// }

// console.log(manager.toString())

// sub1.parent // returns parent Team

client.once('ready', async () => {
    manager.initialize(); // Optional, set up roles, it will enable the Team#role property. It is not needed to detect a member role
    console.log(`Ready on ${client.user.username}`)

    const sorted = await manager.parents.sorted();

    console.log('sorted: ', sorted)
})

//
client.on('message', async message => {

    const member = message.member;

    console.log('member team: ', member.team);

    // member.points.clear();
    //
    // // console.log(member)
    //
    // const points = await member.points.get();
    //
    // const newPoints = await member.points.add(12);
    //
    // console.log(newPoints);


})

client.login(config.token);


// console.log(new TeamsHandler().set('test', '1'));
//
// console.log(manager.subs,);



