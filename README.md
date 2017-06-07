# groupgames
App to view the shared League of Legends match history that 2 or more summoners have

---

To install, clone the repo and run npm install to install the libraries.  You will then need to create a file in the root called .env It's contents should be a key/value pair in the format:


riotAPIKey = $YOUR_CUSTOM_RIOT_API_STRING_HERE

replacing $YOUR_CUSTOM_RIOT_API_STRING_HERE with your Riot API key obtained at https://developer.riotgames.com/

Then start the node.js server by typing node ./bin/www and open your browser to localhost:3000 and you should have the app running.
