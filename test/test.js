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
                    role: '754644003961700382' // optional, used to detect member role if a client and a guildId are given
                }
            ]
        },
        {
            id: 'parent2',
            subs: [
                {
                    id: 'sub2',
                    role: '754681447532593202'
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
    guild: '718743854496612406', // guildId where these teams belong to. It will be used to get roles
    implement: true
});

const client = new Client();

manager.client = client;




client.once('ready', async () => {
    console.log(`Ready on ${client.user.username}`)

    const sub1 = manager.get('sub1');
})

//
client.on('message', async message => {

    console.log(message.guild.teams)


})

client.login(config.token);


// console.log(new TeamsHandler().set('test', '1'));
//
// console.log(manager.subs,);



