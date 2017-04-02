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

//Router will set up
var router = express.Router();              // get an instance of the express Router

//REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working
router.route('/ping')
    .get(function(req, res) {
        res.json({message: 'Ping! I am alive'});
    });

router.route('/summoner/:sumname')
    .get(function(req, res) {
        // TODO - check to see if this user is stored in our local db, if not fetch
        LolApi.Summoner.getByName(req.params.sumname, function(err, summoner) {
            if (!err) {
                //res.json(summoner[req.params.sumname].id);

                // TODO - check to see if match history is < x hours old, if so, fetch new history
                //      - and save to local db
                //

                LolApi.getMatchHistory(summoner[req.params.sumname].id, null, 'na', function(err, history){
                    if(!err){
                        res.json(history);
                    }
                });



            }
        });
    });

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

module.exports = app;
