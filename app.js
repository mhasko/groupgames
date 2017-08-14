//Commenting here just as I'm learning and so others can follow what's
//  going on.

//Express is the web server that runs on nodejs.  it serves both the
//  angular front end as well as the api that angular calls.  That api
//  makes calls to Riot's API as well as caching/saving data to a local
//  DB to reduce calls to riot
var express = require('express');
//This loads a local env file containing things like API cert keys to
//  the Riot API.  This allows the code to use the API key without having
//  to check in the key to GitHub, which is a security risk.  You may
//  have to create this file locally.
//
//  dotenv seems to be the nodejs standard for doing this, so the file
//  is a .env file
require('dotenv').config();
//Required for express to serve up stuff
var bodyParser = require('body-parser');
//3rd party node.js library that wraps calls to Riot's API in an node object
//  Can be found at https://github.com/ChauTNguyen/kindred-api
//var KindredApi = require('kindred-api');
//chalk is a defacto string library for Node
var chalk = require('chalk');
const KindredApi = require('kindred-api')

const RIOT_API_KEY = 'whatever'
const REGIONS = KindredApi.REGIONS
const LIMITS = KindredApi.LIMITS
const InMemoryCache = KindredApi.InMemoryCache
const RedisCache = KindredApi.RedisCache


//Init Kindred with our Riot API key
var k = new KindredApi.Kindred({
    key: process.env.riotAPIKey,
    defaultRegion: REGIONS.NORTH_AMERICA,
    debug: process.env.riotAPIDebug,
    showKey: process.env.riotAPIDebug,
    showHeaders: process.env.riotAPIDebug,
    limits: LIMITS.DEV,
    cache: new InMemoryCache()
});

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
//  calls.  The next() allows the call to continue through to the requested route
router.use(function(req, res, next) {
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
//Pass the entered summoner name to the KindredApi, which converts that to
//  user id and then passes that to the Riot API to get the match history
router.route('/summoner/:sumname')
    .get(function(req, res) {
        var opts = {
            queue: [KindredApi.QUEUE_TYPES.RANKED_SOLO_5x5, KindredApi.QUEUE_TYPES.RANKED_FLEX_SR]
        };

        k.Matchlist.by.name(req.params.sumname, opts)
            .then(data => res.json(data))
            .catch(err => res.json({error:err}));

    });

/* GET /api/match/:matchid */
//Get the game stats for the entered matchid.  Redis will cache this short term
//  while longer term we'll want to do ... something for this?
router.route('/match/:matchid')
    .get(function(req, res){
        k.Match.by.id(parseInt(req.params.matchid))
        .then(data => res.json(data))
        .catch(error => res.json({error:err}));
    });

/* GET /api/static/:champid */
//Get the static data for the given champion
router.route('/static/champ/:champid')
    .get(function(req, res){
        k.Static.Champion.by.id(parseInt(req.params.champid), {tags:'all'})
        .then(data => res.json(data))
        .catch(error => res.json({error:err}));
    })

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

//Boilerplate node.js thing to make all our code visible and usable
module.exports = app;
