//Commenting here just as I'm learning and so others can follow what's
//  going on.

//Express is the web server that runs on nodejs.  it serves both the
//  angular front end as well as the api that angular calls.  That api
//  makes calls to Riot's API as well as caching/saving data to a local
//  DB to reduce calls to riot
var express = require('express');
//This loads a local json file containing things like API cert keys to
//  the Riot API.  This allows the code to use the API key without having
//   to check in the key to GitHub, which is a security risk.  You may
//   have to create this file locally.
var riotConfig = require('./.riotConfig.json');
//Required for express to serve up stuff
var bodyParser = require('body-parser');
//3rd party node.js library that wraps calls to Riot's API in an node object
//  Can be found at https://github.com/claudiowilson/LeagueJS
var LolApi = require('leagueapi');

//Init LolApi with our Riot API key
LolApi.init(riotConfig.riotAPIKey, 'na');

//Init and configure express.  Pretty boilerplate stuff
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Create link to Angular build directory.  I believe this sets the dist dir
//  at the root and serves its contents as static files (express.static(distDir)
//  This allows us to serve front end/web stuff, while futher below we'll set up
//  some API stuff.  Things here won't have their routing done through express,
//  however, since this is probably a single page app we can let Angualr handle
//  all of the 'routing' once index.html is loaded
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

//Router will set up the api calls.  It reads in all the http traffic and 'routes'
//  it to specific endpoints
var router = express.Router();  // get an instance of the express Router

//All of our routes will be prefixed with /api.  Since the front end stuff is in
//  /dist and thus at root, it can follow its own heiarchry, while everything with
//  /api will follow the heiarchry we define in router
app.use('/api', router);

//every router bounce call will go through here.  We can use this to set up basic
//  logging or configuration of headers or what ever needs to be done on all api
//  calls.
router.use(function(req, res, next) {
    //TODO - using console.log is usually not good, find a logging library?
    console.log('Something is happening.');
    next();
});

/* GET /api/ping */
//Our first API call, will simply return a silly little string.  Good for smoke
//  testing if the server is running correctly or not.
router.route('/ping')
    .get(function(req, res) {
        res.json({message: 'Ping! I am alive'});
    });

/* GET /api/summoner/:sumname */
//Pass the entered summoner name and determine the summonerid using the Riot API.
//  Once we have the id, use the summoner id to get its match history
router.route('/summoner/:sumname')
    .get(function(req, res) {
        // TODO - check to see if this user is stored in our local db, if not fetch
        LolApi.Summoner.getByName(req.params.sumname, function(err, summoner) {
            if (!err) {

                // TODO - check to see if match history is < x hours old, if so, fetch new history
                // TODO - and save to local db
                //

                LolApi.getMatchHistory(summoner[req.params.sumname].id, null, 'na', function(err, history){
                    if(!err){
                        //TODO - we need to only save the new match history data in local db

                        //Later on we'll want to do something more exciting with the match history, but for
                        //  now, just return the json of the history
                        res.json(history);
                    }
                });
            }
        });
    });

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    //TODO - using console.log is usually not good, find a logging library?
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

//Boilerplate node.js thing to make all our code visible and usable
module.exports = app;
