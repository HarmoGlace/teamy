# teamy
 A powerful library to manage teams with your own database\
 Made by HarmoGlace
 
# Table of Contents
* [Installation](#install)
* [Examples](#example-usage)
* [API Reference](#api-reference)
* [How to contribute and Suggestions/Problems](#how-to-contribute)
* [Support](#support)
 
## Install
With npm
 ```
$ npm install teamy
 ```
With yarn
```
$ yarn add teamy
```

## Example usage
For a basic teams system using enmap as database:
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

## API Reference

### TeamsManager

#### TeamResolvable
Type: ```Object```\
A TeamResolvable is an ```Object``` that can be resolved to a ```Team```, ```SubTeam``` or ```ParentTeam```, depending of your manager type.

```js
const teamResolvable = {
        id: 'id', // Needed id of the team, will be used internally
        name: 'name', // Optional, common name, it is the id by default
        aliases: ['anotherName'], // Optional Array of string with all aliases of this team
        color: 0x0000, // Optional Hex color of this team
        roleId: '123456789', // Optional Role ID of this team
        type: 'parent', // or 'sub'. Optional, only if you add it manually with an advanced manager
        subs: [ // Needed only if the manager type is advanced
                { // Team resolvable like above but without subs and type properties.
                    id: 'id', // Needed id of the team, will be used internally
                    name: 'name', // Optional, common name, it is the id by default
                    aliases: ['anotherName'], // Optional Array of string with all aliases of this team
                    color: 0x0000, // Optional Hex color of this team
                    roleId: '123456789', // Optional Role ID of this team
                }
            ]
    }
```

#### Options

##### teams [optional]
Type: ```Array``` of [TeamResolvable](#teamresolvable)\
Teams added when creating the ```TeamsManager```\
Even after creating the ```TeamsManager``` you  can add new teams with [manager.teams.add](#teamsadd)

#### functions
Type: ```Object```\
Functions to save points in your database

Functions: 
###### setPoints
Parameters: [Team](#team), ```points``` (number)
###### getPoints
Parameters: [Team](#team)

Example:
```js
const functions = {
    setPoints: (team, points) => database.set(team.id, points),
    getPoints: (team) => database.get(team.id)
}
```

#### type [optional]
Type: ```String```\
Type of TeamsManager. Is either 'basic' or 'advanced'.

Types:
###### basic (default)
Basic teams system where all teams have the same status

###### advanced
Advanced teams system where there are ParentTeams and SubTeams

##### client [optional]
Type: Instance of discord.js ```Client```\
Used to find the team of a GuildMember. Needs the ```guildId``` parameter to work.

##### guildId [optional]
Type: ```String``` (Guild ID)\
ID of the guild where roles of the TeamsManager will be searched. Needs the ```client``` parameter to work.

##### autoInitialize [optional]
Type: ```Boolean```\
Default: ```false```\
If set to true it will automatically set up role property on each team. Do this only if your bot is already launched when you are creating the ```TeamsManager```

#### Properties

#### initialized
Type: ```Boolean```\
Returns ```true``` if the manager has been initialized with the [initialize](#initialize) method

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
manager.teams.find(team => team.name === 'Cool team'); // Returns cool team
```

##### teams.get
Finds a team with an ID. See [above](#teamsfind) for more informations

##### teams.resolve
Resolves a team with a string
```js
manager.teams.resolve('cool team') // returns cool team
```

##### teams.add
Parameter: [TeamResolvable](#teamresolvable)\
Adds a team to the [TeamsManager](#teamsmanager)

##### teams.remove
Parameter: [TeamResolvable](#teamresolvable)\
Removes a team from the [TeamsManager](#teamsmanager)

##### teams.set
Parameter: ```Array``` of [TeamResolvable](#teamresolvable)\
Removes every team to add these teams. Use this carefully

##### initialize
Creates ```role``` property for each team. Needs the ```client``` and ```guildId``` options when creating this manager. Not needed to use the ```getMemberTeam``` method.
Do it once your bot is launched.\
Note that if your initialize the ```TeamsManager``` once your bot is launched you can use the ````autoInitialize```` option when creating the ```TeamsManager```.

##### getMemberTeam
Returns the team of a discord.js ```GuildMember```. Needs the ````client```` and ```guildId``` options, but doesn't need to use the above method before.

### Team

#### Properties

##### id
Type: ```String```\
Returns the team id

##### name
Type: ```!String```

Returns the team name if set

##### aliases
Type: ```Array``` of ```String```\
Default: ```[]```\
Returns team name aliases

##### color
Type: ```Number```\
Default: ```0x000000```\
Returns the team color

##### roleId
Type: ```!String```\
Returns the role ID of the team if set

##### role
Type: ```Role``` (from discord.js)\
Returns the role of the team if ```roleId``` of this team is set and if ```client``` and ```guildId``` parameters are supplied to the ```TeamsManager```and if it is initialized 

#### Methods

##### points.get
Return the current points of the team\
Example: 
```js
team.points.get(); // returns the current points of the team
```

##### points.set
Parameters: points to set\
Sets the points of the team

##### points.add
Parameters: points to add\
Add points to a team

##### points.remove
Parameters: points to remove\
Remove points to a team

##### points.parent
Returns the points of the parent team, if the type of the manager is set to ```advanced```

## How to contribute

Please note that teamy is still in development.\
If you are here it means that you want to help me, thank you !

To contribute, create a fork of your [this project](https://github.com/HarmoGlace/teamy), edit the things that you want and create a Pull Request.
If you want to suggest something or report a bug, create an issue

## Support
You can contact me here :\
Discord : HarmoGlace#7746\
Twitter: [@HarmoGlace](https://twitter.com/HarmoGlace)