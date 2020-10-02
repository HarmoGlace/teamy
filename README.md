[![NPM](https://nodei.co/npm/teamy.png?compact=true)](https://nodei.co/npm/teamy/)

# teamy
 A powerful library to manage teams with your own database\
 Made by HarmoGlace
 
# Table of Contents
* [Installation](#installation)
* [Examples](#example-usage)
* [API Reference](#api-reference)
* [How to contribute](#how-to-contribute)
* [Feedback](#feedback)
    * [Report an issue](#report-an-issue)
    * [Suggest something](#suggest-something)
* [Support](#support)
 
## Installation
With npm
 ```
$ npm install teamy
 ```
With yarn
```
$ yarn add teamy
```

Recommended node version: 14.12.0 (Current)\
Required node version: 14.4.0

## Example usage
For a basic teams system using [enmap](https://www.npmjs.com/package/enmap) as database provider:
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
        functions: { // Can be async functions or can return a promise
            setPoints: (team, points) => points.set(team.id, points),
            getPoints: (team) => points.get(team)
        }
});

const coolTeam = manager.get('cool_team');

coolTeam.points.add(500);

coolTeam.points.get(); // returns 500

manager.toArray() // returns an array of all teams

manager.resolve('a pretty cool team') // returns 'a pretty cool team' Team
```

For an advanced system with parent teams and sub teams and team detection with a role (using discord.js) :
```js
const { TeamsManager } = require('teamy');
const { Client } = require('discord.js');
const client = new Client();
const Enmap = require('enmap');
const pointsDB = new Enmap({name: 'points'});

const manager = new TeamsManager({
    type: 'advanced',
    teams: [
            {
                id: 'parent1',
                role: '123456789', // Optional
                subs: [
                    {
                        id: 'sub1',
                        role: '123456789' // optional, used to detect member role if a client and a guildId are given
                    }
                ]
            },
            {
                id: 'parent2',
                subs: [
                    {
                        id: 'sub2',
                        role: '23456789'
                    }
                ]
            }
        ],
    functions: { // Needed. Used to save points, you can use the database that you want, here it is enmap
        setPoints: (team, points) => pointsDB.set(team.id, points),
        getPoints: (team) => pointsDB.get(team.id)
    },
    client,
    guild: '123456789' // guild Id where these teams belong to. It will be used to get roles
});

const sub1 = manager.get('sub1');

sub1.points.add(153);

sub1.points.get() // return 153

sub1.parent // returns parent Team

client.on('message', message => {
    const team = manager.functions.getMemberTeam(message.member); // returns the member team or null if none is found. See below example for an easier way to do it
})
```

## API Reference

**The api reference is available at [teamy.harmoglace.fr](https://teamy.harmoglace.fr)**


##### How to have a team property on GuildMembers with implement TeamsMaager optio [optional]
Type: ```Boolean```\
Options passed to the TeamsManager, if set to true, it will enable [team](#getmemberteam) and [teams](#getmemberteams) properties on each GuildMember.\
For that you need to instantiate your client after creating the [TeamsManager](#teamsmanager)\
Example (using a basic manager and with enmap as DB provider):
````js
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
            getPoints: (team) => points.get(team),
   
            getMemberTeam: (member, teams) => teams.find(team => member.roles.cache.has(team.roleId)
        },
        guild: '123456',  // guild Id where all roles are from
        implement: true
});

const { Client } = require('discord.js');
const client = new Client();

manager.client = client;

client.on('message', message => {
    message.member.team; // Returns the member team or null if none is found
})
````

## How to contribute

Please note that teamy is still in development.\
If you are here it means that you want to help me, thank you !

To contribute, create a fork of your [this project](https://github.com/HarmoGlace/teamy), edit the things that you want and create a Pull Request.

## Feedback

### Report an issue

If you want to report an issue, open an issue [here](https://github.com/HarmoGlace/teamy/issues/new/choose) using the bug report template\
Please check that you have the [required node version](#installation) at least and that you have the latest version of teamy

### Suggest something

If you want to suggest something you are welcome !\
Open an issue [here](https://github.com/HarmoGlace/teamy/issues/new/choose) using the suggestion template.

## Support

Do you need help ? Join the [Teamy Discord server](https://discord.gg/eMuBJMj)