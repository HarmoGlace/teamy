# teamy
 A powerful library to manage teams. You can use your own database !
 
 ## Installation
 ```
npm install teamy
 ```

## Example usage
For a basic teams system using enmap as database :
```js
const { TeamsManager } = require('teamy');
const Enmap = require('enmap');
const points = new Enmap({name: 'points'});

const manager = new TeamsManager({
        teams: [
            {
                id: 'cool_team',
                name: 'A pretty cool team'
            },
            {
                id: 'another_cool_team',
                name: 'Another cool team'
            }
        ],
        functions: {
            setPoints: (team, points) => points.set(team.id, points),
            getPoints: (team) => points.get(team)
        }
});

const coolTeam = manager.teams.get('cool_team');

coolTeam.points.add(500);

coolTeam.points.get(); // returns 500

manager.teams.all // returns all teams

manager.teams.resolve('a pretty cool team') // returns 'a pretty cool team' Team
```

For an advanced system with parent teams and sub teams and team detection with a role (using discord.js) :
```js
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
```

## API

### TeamsManager
#### Options

##### teams
Type: Array of objects\
Example :
```js
[
    {
        id: 'id', // Needed id of the team, will be used internally
        name: 'name', // Optional, common name, it is the id by default
        aliases: ['anotherName'], // Optional Array of string with all aliases of this team
        color: 0x0000, // Optional Hex color of this team
        roleId: '123456789' // Optional Role ID of this team
    }
]
```

#### functions
Type : Object\
Functions to save points in your database

Functions: 
###### setPoints
Parameters: team, points
###### getPoints
Parameters: team

Example :
```js
{
    setPoints = (team, points) => database.set(team.id, points),
    getPoints = (team) => database.get(team.id)
}
```

#### type [optional]
Type : String\
Type of TeamsManager. Is either 'basic' or 'advanced'.

Types :
###### basic (default)
Basic teams system where all teams has the same status

###### advanced
Advanced teams system where there are ParentTeams and SubTeams

##### client [optional]
Type : Instance of discord.js client\
Used to find the team of a GuildMember. Needs the ```guildId``` parameter to work.

##### guildId [optional]
Type : String (Guild ID)\
ID of the guild where roles of the TeamsManager will be searched. Needs the ```client````parameter to work.

#### Methods

##### teams.all
Returns all teams

##### teams.parents
Return all parent teams (if the type of the TeamsManager is ```advanced```)

##### teams.subs
Return all subs teams (if the type of the TeamsManager is ```advanced```)

##### teams.find
Finds a team with a function with each team as parameter. See [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)\
Example: 
```js
teams.find(team => team.name === 'Cool team'); // Returns cool team
```

##### teams.get
Finds a team with an ID. See above for more informations

##### teams.resolve
Resolves a team with a string
```js
teams.resolve('cool team') // returns cool team
```

##### initialize
Creates ```role``` property for each team. Needs the ```client``` and ```guildId``` options when creating this manager. Not needed to use the ```getMemberTeam``` method

##### getMemberTeam
Returns the team of a discord.js ```GuildMember```. Needs the ````client```` and ```guildId``` options, but doesn't need to use the above method before.

### Team

#### Methods

##### points.get
Return the current points of the team\
Example: 
```js
team.points.get(); // returns the current points of the team
```

##### points.set
Parameters : points to set\
Sets the points of the team

##### points.add
Parameters: points to add\
Add points to a team

##### points.remove
Parameters: points to remove\
Remove points to a team

##### points.parent
Returns the points of the parent team, if the type of the manager is set to ```advanced```