In this tutorial you will learn how to use teamy with node.js (v14.0.0 at least), in javascript.

We will start by importing the {@link TeamsManager} class :
```js
const { TeamsManager } = require('teamy');
```

A {@link TeamsManager} is a class that will manage for you all your teams. You can manually create team but it is hader than using the {@link TeamsManager}

Now you will have to create a new instance of this class, here we will name it manager.
There is only one thing needed : The points functions. To save points and get it you will need to provide functions that will do it with your database. Teamy doesn't provide this by default. In this example we will use enmap, an easy-to-use database provider

So the needed parameter is named `functions` (see {@link TeamsManagerFunctions}). It is an object that have 2 functions. These can be async or return a promise:
- setPoints function with 2 parameters : `team` and `points` to set. The team parameter can be a {@link Team} or a {@link ParentTeam}/{@link SubTeam}, depending of your TeamsManager type. We will see this after
- getPoints function with 1 parameter: `team`. It can be a {@link Team} or a {@link ParentTeam}/{@link SubTeam}, depending of your TeamsManager type too.

```js
const Enmap = require('enmap'); // Do NOT put this line if you do not use enmap
const database = new Enmap({name: 'teamy'}); // Do NOT put this line if you do not use enmap

const manager = new TeamsManager({
    functions: {
        setPoints: (team, points) => database.set(team.id, points), // your setPoints function
        getPoints: (team) => database.get(team.id) // your getPoints function
    }
})
```

The above example contains the needed options for the TeamsManager, but you can also provide directly your teams.

The option is named `teams` and it takes an `Array` of {@link TeamResolvable} as parameter.

```js
const manager = new TeamsManager({
    teams: [
        {
                id: 'id', // Needed, id of the team, will be used internally or to get a team
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
    ]
})
```

You have now a basic teamy configuration.

### How can I get a team ?

If you want to find a team, it is easy. You can use the `find` function on the {@link TeamsManager}. It is like the find function on an array [(see mdn)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) :


```js
const team = manager.get('first team'); // returns 'first team' Team or null if none is found
```

It will return a {@link Team} or null if none is found.

If it returns a {@link Team}, you can manage the team points easily like that :

```js
team.points.add(5) // add 5 points to the team

team.points.remove(3) // remove 3 points

team.points.set(15) // Set the team points to 15
```

Note that these methods returns a promise of the new points of the Team.

Now you know how to use teamy !
If you want an advanced configuration with Parent Teams and Sub Teams, look at [the advanced configuration tutorial](./tutorial-starting.html) (coming soon)